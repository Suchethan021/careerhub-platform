# Authorization Explained: RLS vs Traditional RBAC

This document provides a deep dive on how authorization works in CareerHub and why we chose Row Level Security (RLS) instead of traditional role-based access control (RBAC).

---

## 1. Authorization Models Explained

### 1.1 Traditional RBAC (What You Might Know)

The classic permission system uses lookup tables:

```sql
-- Users table
users: id, name, email

-- Roles table
roles: id, role_name (e.g., 'recruiter', 'candidate')

-- Users to Roles mapping
user_roles: user_id, role_id

-- Permissions table
permissions: id, permission_name (e.g., 'create_job', 'view_jobs')

-- Roles to Permissions mapping
role_permissions: role_id, permission_id
```

**How it works (in application code):**

```typescript
// 1. Get user's role
const userRoles = await db.query(
  'SELECT r.id FROM roles r JOIN user_roles ur ON ur.role_id = r.id WHERE ur.user_id = ?',
  [userId]
);

// 2. Get permissions for those roles
const permissions = await db.query(
  'SELECT p.name FROM permissions p JOIN role_permissions rp ON rp.permission_id = p.id WHERE rp.role_id IN (?)',
  [userRoles]
);

// 3. Check in application
if (permissions.includes('view_company')) {
  allowAccess();
} else {
  denyAccess();
}

// 4. If check passes, query data
const company = await db.query('SELECT * FROM companies WHERE id = ?', [companyId]);
```

**Problem:** Authorization check is in application code. If you forget to check, data leaks.

---

### 1.2 Row Level Security (RLS) - PostgreSQL Native

Instead of application-level checks, we use database policies:

```sql
-- No special lookup tables needed!
-- Authorization is a policy on the table itself

CREATE POLICY recruiter_company_access ON companies
FOR ALL  -- Applies to SELECT, INSERT, UPDATE, DELETE
USING (
  -- Who can see this row?
  recruiter_id = auth.uid()
)
WITH CHECK (
  -- Who can modify this row?
  recruiter_id = auth.uid()
);
```

**How it works:**

```typescript
// 1. Fetch companies (RLS automatic)
const { data: companies } = await supabase
  .from('companies')
  .select('*');

// PostgreSQL automatically:
// - Checks RLS policy
// - Only returns rows where recruiter_id = current_user_id
// - If not authorized, returns empty array (no error)
```

**Key difference:** Authorization enforced at database level. Every query, automatically.

---

## 2. Why RLS is Better for Multi-Tenancy

### Example Scenario

**Recruiter logs in:**
- User ID: `user-123`
- Works for company: `company-456`

**With RBAC (application-level):**
```typescript
// Recruiter views their jobs
const jobs = await db.query('SELECT * FROM jobs WHERE company_id = ?', [companyId]);
// ✅ Works

// But if developer forgets to check company_id:
const jobs = await db.query('SELECT * FROM jobs');  // ❌ OOPS: All jobs visible!
```

**With RLS (database-level):**
```sql
CREATE POLICY job_access ON jobs
FOR SELECT
USING (
  company_id IN (
    SELECT id FROM companies WHERE recruiter_id = auth.uid()
  )
);
```

```typescript
// Any query for jobs:
const jobs = await supabase.from('jobs').select('*');
// PostgreSQL automatically applies WHERE company_id IN (SELECT id FROM companies WHERE recruiter_id = user-123)
// Even if developer forgets WHERE clause, RLS handles it
```

**RLS prevents data leaks by design.**

---

## 3. Multi-Persona Authorization

### Current MVP: 2 Personas

**Recruiter:**
- Can see/edit their own company
- Can see/edit their own jobs
- Can see/edit their own content sections

**Candidate:**
- Can see published companies only
- Can see open jobs from published companies
- Cannot edit anything

**Implementation:**

```sql
-- COMPANIES TABLE POLICIES

-- Policy 1: Recruiters see only their own company
CREATE POLICY recruiter_company_access ON companies
FOR ALL
USING (recruiter_id = auth.uid())
WITH CHECK (recruiter_id = auth.uid());

-- Policy 2: Candidates see only published companies
CREATE POLICY candidate_company_access ON companies
FOR SELECT
USING (is_published = TRUE);

-- JOBS TABLE POLICIES

-- Policy 1: Recruiters manage their company's jobs
CREATE POLICY recruiter_jobs ON jobs
FOR ALL
USING (
  company_id IN (
    SELECT id FROM companies WHERE recruiter_id = auth.uid()
  )
)
WITH CHECK (
  company_id IN (
    SELECT id FROM companies WHERE recruiter_id = auth.uid()
  )
);

-- Policy 2: Candidates see only open jobs
CREATE POLICY candidate_jobs ON jobs
FOR SELECT
USING (
  company_id IN (
    SELECT id FROM companies WHERE is_published = TRUE
  )
  AND status = 'open'
);
```

### Future: 3+ Personas

When you add more roles (Hiring Manager, Reviewer, Admin), you have options:

**Option A: Add role column to auth.users**

```sql
-- Extend Supabase auth users
ALTER TABLE auth.users 
ADD COLUMN role VARCHAR(50) DEFAULT 'candidate';
-- Values: 'candidate', 'recruiter', 'hiring_manager', 'admin'

-- Update policies to check role
CREATE POLICY admin_access ON companies
FOR ALL
USING (
  (current_setting('request.jwt.claims', true)::jsonb->>'user_metadata'->>'role' = 'admin') OR
  (recruiter_id = auth.uid())
);
```

**Option B: Create company_members junction table**

```sql
CREATE TABLE company_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50),  -- 'recruiter', 'hiring_manager', 'reviewer'
  permissions JSONB,  -- Flexible: can override base role permissions
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(company_id, user_id)
);

-- New policy: anyone in company_members can access company
CREATE POLICY team_access ON companies
FOR ALL
USING (
  (recruiter_id = auth.uid()) OR  -- Original recruiter
  (id IN (
    SELECT company_id FROM company_members 
    WHERE user_id = auth.uid()
  ))
);

-- Granular permission checks for actions
CREATE POLICY job_delete_check ON jobs
FOR DELETE
USING (
  company_id IN (
    SELECT company_id FROM company_members 
    WHERE user_id = auth.uid() 
    AND (
      role IN ('recruiter', 'admin') OR
      permissions->>'can_delete_jobs' = 'true'
    )
  )
);
```

### Which Approach to Choose?

**Option A (role in auth.users):**
- ✅ Simpler for global roles (same role everywhere)
- ✅ Faster queries (fewer joins)
- ❌ Can't have different roles per company

**Option B (company_members table):**
- ✅ Different roles per company (e.g., Hiring Manager only for Company A)
- ✅ Flexible permissions (can override per person)
- ✅ Easier to scale (add/remove team members)
- ❌ More complex queries

**For CareerHub Future:** Start with Option B. It's more flexible and what ATS systems actually need.

---

## 4. RLS vs Traditional RBAC: Real-World Example

### Scenario: Add "Hiring Manager" Role

**Traditional RBAC approach (Application-Level):**

1. Create hiring_manager role
2. Add permission: can_edit_jobs
3. In code, check: if (user.role === 'hiring_manager' && permission.can_edit_jobs) { allowEdit }
4. Update 5+ places where jobs are edited

**Problem:** Easy to miss one location.

**RLS approach (Database-Level):**

```sql
-- One place, updated once:
CREATE POLICY hiring_manager_job_edit ON jobs
FOR UPDATE
USING (
  company_id IN (
    SELECT company_id FROM company_members 
    WHERE user_id = auth.uid() 
    AND role = 'hiring_manager'
  )
)
WITH CHECK (
  company_id IN (
    SELECT company_id FROM company_members 
    WHERE user_id = auth.uid() 
    AND role = 'hiring_manager'
  )
);

-- All existing code still works, new permission applies automatically
```

---

## 5. How to Debug RLS Issues

### Issue: "Permission denied" even though user should have access

**Debug Steps:**

1. **Check the policy exists:**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'companies';
   ```

2. **Verify auth.uid() is set:**
   ```sql
   -- In Supabase SQL Editor, run as your user:
   SELECT auth.uid();  -- Should return your user ID
   ```

3. **Test the policy condition manually:**
   ```sql
   -- Does this user own this company?
   SELECT * FROM companies 
   WHERE id = 'company-123' 
   AND recruiter_id = auth.uid();
   ```

4. **Check JWT claims:**
   ```sql
   -- View what's in the JWT token
   SELECT current_setting('request.jwt.claims', true);
   ```

5. **Disable RLS temporarily to test:**
   ```sql
   ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
   -- Test if query works
   ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
   ```

### Common Mistakes

**Mistake 1: Forgetting WITH CHECK**
```sql
-- Wrong: Can see but not modify
CREATE POLICY job_edit ON jobs
FOR UPDATE
USING (company_id = 'company-123');  -- Missing WITH CHECK

-- Right:
CREATE POLICY job_edit ON jobs
FOR UPDATE
USING (company_id = 'company-123')
WITH CHECK (company_id = 'company-123');
```

**Mistake 2: Subquery returning wrong results**
```sql
-- Wrong: Returns all companies, not just user's
CREATE POLICY company_access ON companies
FOR ALL
USING (id IN (SELECT id FROM companies));  -- Returns ALL

-- Right: Filters by recruiter
CREATE POLICY company_access ON companies
FOR ALL
USING (recruiter_id = auth.uid());
```

**Mistake 3: Case sensitivity**
```sql
-- PostgreSQL is case-sensitive for values
CREATE POLICY job_status ON jobs
FOR SELECT
USING (status = 'open');  -- lowercase

-- But code might send:
const jobs = await supabase.from('jobs')
  .select('*')
  .eq('status', 'OPEN');  // Uppercase - won't match!
```

---

## 6. Performance Considerations with RLS

### Query Execution with RLS

```sql
-- Simple query:
SELECT * FROM jobs WHERE company_id = 'company-123';

-- Becomes (with RLS):
SELECT * FROM jobs 
WHERE company_id = 'company-123'
AND company_id IN (
  SELECT id FROM companies WHERE recruiter_id = auth.uid()
);
```

**Index Strategy:**
```sql
-- Make sure to index on both the main filter AND the RLS condition
CREATE INDEX idx_jobs_company ON jobs(company_id);
CREATE INDEX idx_companies_recruiter ON companies(recruiter_id);

-- For complex subqueries, consider materialized view:
CREATE MATERIALIZED VIEW user_companies AS
SELECT id FROM companies WHERE recruiter_id = auth.uid();

-- Then RLS policy can use:
CREATE POLICY job_access ON jobs
FOR ALL
USING (company_id IN (SELECT id FROM user_companies));
```

### Performance Monitoring

```sql
-- Check query execution plan
EXPLAIN ANALYZE
SELECT * FROM jobs 
WHERE company_id = 'company-123';

-- Look for:
-- ✅ "Index Scan" (good, using index)
-- ❌ "Seq Scan" (bad, full table scan)
```

---

## 7. JWT Claims & Custom Context

Supabase lets you pass custom data in JWT:

```typescript
// When creating user, add metadata
const { data, error } = await supabase.auth.signUp({
  email: 'recruiter@company.com',
  password: 'password123',
  options: {
    data: {
      role: 'recruiter',
      company_id: 'company-123'
    }
  }
});

// This gets embedded in JWT
```

**Use in RLS policy:**

```sql
CREATE POLICY job_access ON jobs
FOR ALL
USING (
  company_id = (current_setting('request.jwt.claims', true)::jsonb->>'company_id')::uuid
);
```

**Trade-off:**
- ✅ Simpler policy (no subquery)
- ❌ Need to update JWT if company changes
- ❌ Can't use JWT for frequently-changing permissions

**Recommendation:** Use subqueries (more flexible) unless JWT approach is significantly faster (benchmark first).

---

## 8. RLS Best Practices

### Do's ✅

1. **Use RLS for all sensitive tables**
   ```sql
   ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
   ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
   ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;
   ```

2. **Test policies with different user roles**
   ```typescript
   // Test as recruiter
   const recruiterClient = supabase.auth.setSession(recruiterToken);
   const companies = await recruiterClient.from('companies').select('*');
   expect(companies.length).toBe(1);  // Should only see their company

   // Test as candidate
   const candidateClient = supabase.auth.setSession(candidateToken);
   const companies = await candidateClient.from('companies').select('*');
   expect(companies.every(c => c.is_published)).toBe(true);
   ```

3. **Document policies with comments**
   ```sql
   -- Allows recruiters to view/edit only their own company
   -- Used for multi-tenancy isolation
   CREATE POLICY recruiter_access ON companies
   FOR ALL
   USING (recruiter_id = auth.uid())
   WITH CHECK (recruiter_id = auth.uid());
   ```

4. **Start restrictive, relax if needed**
   ```sql
   -- Start with this (most restrictive):
   CREATE POLICY job_view ON jobs FOR SELECT USING (FALSE);
   
   -- Then add specific access:
   CREATE POLICY job_view_recruiter ON jobs FOR SELECT 
   USING (company_id IN (SELECT id FROM companies WHERE recruiter_id = auth.uid()));
   ```

### Don'ts ❌

1. **Don't skip RLS for "internal" tables**
   - All tables should have policies
   - Prevents accidental data exposure

2. **Don't use SECURITY DEFINER functions carelessly**
   ```sql
   -- SECURITY DEFINER bypasses RLS (dangerous!)
   CREATE FUNCTION get_all_jobs() RETURNS TABLE(...) AS $$
     SELECT * FROM jobs;  -- RLS bypassed!
   $$ LANGUAGE sql SECURITY DEFINER;
   
   -- Only use when necessary, and carefully limit
   ```

3. **Don't hardcode user IDs**
   ```sql
   -- Bad: Only works for one user
   CREATE POLICY bad_policy ON companies
   USING (recruiter_id = 'hardcoded-user-id'::uuid);

   -- Good: Uses current user
   CREATE POLICY good_policy ON companies
   USING (recruiter_id = auth.uid());
   ```

4. **Don't forget USING + WITH CHECK for DML operations**
   ```sql
   -- Bad: Only specifies USING
   CREATE POLICY incomplete ON jobs
   FOR UPDATE
   USING (company_id = 'company-123');

   -- Good: Both USING and WITH CHECK
   CREATE POLICY complete ON jobs
   FOR UPDATE
   USING (company_id = 'company-123')
   WITH CHECK (company_id = 'company-123');
   ```

---

## 9. Migration Path: RBAC → RLS

If you have existing RBAC system, here's how to migrate:

**Current (RBAC):**
```sql
CREATE TABLE roles (id, name);
CREATE TABLE permissions (id, name);
CREATE TABLE user_roles (user_id, role_id);
CREATE TABLE role_permissions (role_id, permission_id);

-- Application checks permissions
```

**Migrate to RLS:**

```sql
-- Step 1: Add role to auth.users (optional, if global roles)
ALTER TABLE auth.users ADD COLUMN role VARCHAR(50);

-- Step 2: Create RLS policies based on existing RBAC
CREATE POLICY role_based_access ON companies
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = auth.uid()
    AND p.name = 'view_companies'
  )
);

-- Step 3: Remove permission checks from application code (they're now in DB)

-- Step 4: Gradually simplify RLS policies as you refactor RBAC
```

---

## Summary

**RLS (Row Level Security) is superior to application-level RBAC for multi-tenant systems because:**

1. **Enforced at database level** - Can't bypass with code changes
2. **Automatic on all queries** - No chance of forgetting permission check
3. **Simpler to scale** - Add new roles by updating policies, not code
4. **Harder to leak data** - Even bugs in application can't expose unauthorized data
5. **More secure** - Cryptographically enforced by PostgreSQL

**For interviews:** Be prepared to explain that RLS is the modern approach, while traditional RBAC is still common in legacy systems. Know when to use each.

