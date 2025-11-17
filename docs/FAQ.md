# Frequently Asked Questions (FAQ): CareerHub Development Guide

This document answers questions that came up during design and development.

---

## Technical Questions

### Q: Why didn't you choose Next.js instead of Vite + React?

**A:** For this MVP, Vite is better because:

- **Speed:** Vite builds in 0.5 seconds vs Next.js 3-5 seconds. During development, hot reload is <100ms vs 1-2 seconds.
- **Simplicity:** Vite has zero opinionated structure. Next.js assumes you want API routes, SSR, etc. We don't need those yet.
- **Supabase handles backend:** We don't need Next.js API routes (Supabase provides REST API).
- **SEO doesn't need SSR:** We're using React Helmet for meta tags. Google's crawler handles JavaScript.

**When to migrate to Next.js:** If we need server-side rendering (for better initial load performance or complex SEO), we'd migrate. But current approach is sufficient and faster to build.

---

### Q: Do we really need RLS? Can't we just check in the app?

**A:** RLS is critical. Here's why:

**With app-level checks:**
```typescript
// Recruiter viewing their jobs
if (user.role === 'recruiter') {
  const jobs = await supabase.from('jobs').select('*');
}
```

**Problem:** If developer forgets the role check once:
```typescript
// Oops! Now anyone sees all jobs
const jobs = await supabase.from('jobs').select('*');
```

**With RLS:**
```sql
CREATE POLICY recruiter_jobs ON jobs
FOR SELECT
USING (
  company_id IN (
    SELECT id FROM companies WHERE recruiter_id = auth.uid()
  )
);
```

```typescript
// ANY query for jobs is automatically scoped
const jobs = await supabase.from('jobs').select('*');
// PostgreSQL adds: WHERE company_id IN (SELECT id FROM companies WHERE recruiter_id = current_user)
```

**RLS is enforced at database level. Code bugs can't bypass it.**

---

### Q: Can we do everything Supabase provides with a backend?

**A:** Yes, but why?

| Feature | Supabase | Backend |
|---------|----------|---------|
| Auth | Built-in | You build it |
| REST API | Auto-generated | You write endpoints |
| Permissions | RLS policies | Middleware/decorators |
| Real-time | WebSockets | You implement |
| Database | PostgreSQL | You manage |
| Cost | Free tier | $5-15/month |
| Ops burden | Zero | High |

For MVP, Supabase = 10x faster with same end result.

Backend becomes useful when you need: email (SendGrid), webhooks (3rd party), complex business logic (ML models), or scheduled jobs (cron).

**We're not saying "never build backend." We're saying "not needed for MVP."**

---

### Q: What about large datasets? Client-side filtering won't scale?

**A:** Great question. Here's the strategy:

**Phase 1 (MVP): Client-side filtering**
- Fetch all open jobs (usually <1000)
- Filter in React (location, type, level)
- Works great for startups, smaller companies

**Phase 2 (When you hit limits):**
```typescript
// Move to server-side filtering
const { data: jobs } = await supabase
  .from('jobs')
  .select('*')
  .eq('company_id', companyId)
  .eq('status', 'open')
  .eq('location', selectedLocation)  // Filter at DB
  .eq('job_type', selectedType)      // Filter at DB
  .ilike('title', `%${searchTerm}%`) // Full-text search
  .limit(20)
  .range(0, 19);  // Pagination
```

**Phase 3 (Enterprise scale):**
- Add Elasticsearch for advanced search
- Implement pagination (20 jobs per page)
- Add caching (Redis)
- Read replicas for heavy queries

**Transition is smooth:** No breaking changes, just query method changes.

---

### Q: Should we use GitHub Actions for CI/CD?

**A:** Not needed for MVP. Here's why:

**What GitHub Actions would do:**
- Run tests on every push
- Build app
- Deploy to server

**What Vercel does automatically:**
- Detects git push
- Runs build (detects Vite config)
- Deploys in ~40 seconds
- No config needed

**When to add GitHub Actions:** If you need pre-deploy checks (tests must pass, code quality gates). For MVP, manual testing is fine.

---

### Q: Do we need .env in git?

**A:** Absolutely not. `.env.local` should NEVER be committed.

**Why:**
- Contains Supabase keys
- If compromised, database is exposed
- Anyone who clones can access production data

**Safe approach:**
```bash
# .gitignore
.env.local
.env

# Commit this instead:
.env.example
```

**For local development:**
- Create `.env.local` (not committed)
- Copy from `.env.example`
- Fill in your own keys

**For Vercel production:**
- Add env vars in Vercel dashboard
- No .env file needed

---

## Architecture Questions

### Q: How do I handle users switching companies?

**A:** In MVP, one recruiter = one company. Not an issue yet.

**Phase 2 (Multi-recruiter support):**
```sql
CREATE TABLE company_members (
  user_id UUID,
  company_id UUID,
  role VARCHAR(50),
  PRIMARY KEY (user_id, company_id)
);

-- User selects company in dashboard:
-- "Switch to Tech Corp India"
```

**In app:**
```typescript
const [selectedCompanyId, setSelectedCompanyId] = useState(null);

// Then all queries scoped to that company:
const jobs = await getJobs(selectedCompanyId);
```

No RLS changes needed—same pattern scales.

---

### Q: Why not use GraphQL instead of REST?

**A:** For MVP, REST is simpler.

| Aspect | REST | GraphQL |
|--------|------|---------|
| **Learning** | Simple | Complex |
| **Setup** | Auto (Supabase) | Requires Apollo/etc |
| **Performance** | Good | Great (specific fields) |
| **Caching** | HTTP caching | Custom layer |

**GraphQL is better for:** Large schemas, complex filtering, mobile data usage.
**REST is better for:** MVP, simple CRUD, fast iteration.

Supabase provides both. We're using REST for speed.

---

### Q: What's the difference between soft and hard deletes?

**A:** Soft delete = logical delete. Hard delete = physical delete.

**Soft Delete:**
```sql
UPDATE jobs SET deleted_at = NOW() WHERE id = 'job-123';
-- Record still in database, marked as deleted
```

**Hard Delete:**
```sql
DELETE FROM jobs WHERE id = 'job-123';
-- Record removed permanently
```

**Why soft delete?**
- Audit trail (can see what was deleted)
- Data recovery (restore if needed)
- Analytics not affected (can count deleted jobs)
- Compliance (many industries require audit logs)

**Queries always filter soft deletes:**
```sql
SELECT * FROM jobs WHERE deleted_at IS NULL;
```

**Never do hard deletes** unless you have specific legal requirement (e.g., GDPR right to be forgotten).

---

### Q: How do we handle timezone issues?

**A:** Store everything in UTC in database.

```sql
-- Always UTC
created_at TIMESTAMP DEFAULT NOW(),  -- UTC in database

-- Convert to user's timezone in application
const userTime = new Date(created_at).toLocaleString('en-IN', {
  timeZone: 'Asia/Kolkata'  // User's timezone
});
```

**Why:** Timezones are complex (daylight saving, regions). Database should never care. Client handles display.

---

### Q: Should we implement caching?

**A:** Not for MVP. Add when needed:

**MVP (Current):**
- Database queries direct to Supabase
- Fast enough (<100ms)
- Simple

**Phase 2 (If slow):**
- Add Redis caching
- Cache expensive queries (company profiles)
- Invalidate on updates

```typescript
// Pseudocode
const company = await redis.get(`company:${slug}`);
if (!company) {
  const company = await supabase.from('companies').select('*').eq('slug', slug);
  await redis.set(`company:${slug}`, company, { ex: 3600 });  // 1 hour TTL
}
```

**Don't optimize early.** Cache only when you measure slow queries.

---

## Data & Seeding Questions

### Q: How do we seed sample data?

**A:** Two approaches:

**Approach 1: SQL seed file**
```sql
INSERT INTO companies (name, slug, recruiter_id, primary_color)
VALUES ('Tech Corp India', 'tech-corp-india', 'user-uuid', '#0066CC');
```

**Approach 2: JavaScript seed script**
```typescript
// scripts/seed.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);

await supabase.from('companies').insert([
  {
    name: 'Tech Corp India',
    slug: 'tech-corp-india',
    recruiter_id: 'user-uuid',
    primary_color: '#0066CC'
  }
]);
```

**For MVP:** Use SQL seed file (simpler, reproducible).

---

### Q: Where should we store sample logos?

**A:** `public/sample-data/logos/`

```
public/
├── sample-data/
│   ├── logos/
│   │   ├── tech-corp-logo.png
│   │   ├── design-studio-logo.png
│   │   └── startup-logo.png
│   └── jobs.json
```

**Candidates can download and test with these logos.** Auto-adjust in UI (responsive images).

---

### Q: Do we really need to import jobs from Google Sheets?

**A:** The assignment provides sample data in a Google Sheet. We should:

1. **Export as JSON** from the sheet
2. **Save to** `public/sample-data/jobs.json`
3. **Document** in README how to use it
4. **Provide seed script** to import

---

## Scaling & Future Questions

### Q: How does this scale to 1000 companies?

**A:** Great question for interviews:

**MVP (Current):**
- 1 Supabase free project (500MB, unlimited companies)
- Vercel auto-scales
- RLS ensures multi-tenancy works

**At 500 companies:**
- Database still <100MB (1 company ≈ 100-200KB data)
- Upgrade Supabase to Pro ($25/month) for monitoring
- Add indexes to watch slow queries

**At 10,000 companies:**
- Database ≈ 1-2GB (now hitting limits)
- Upgrade Supabase to Business plan or self-host PostgreSQL
- Consider read replicas for reporting
- Implement caching layer (Redis)

**At 100,000+ companies:**
- Multi-region deployment (edge functions)
- Database sharding (split by region)
- Separate read/write databases
- CDN caching for public pages

**Key:** RLS handles multi-tenancy from day 1. No architectural changes needed—just infrastructure upgrades.

---

### Q: What if we need to add a new table?

**A:** Just add RLS policies:

```sql
-- New table
CREATE TABLE job_tags (
  id UUID PRIMARY KEY,
  job_id UUID REFERENCES jobs(id),
  tag VARCHAR(50)
);

-- RLS policy
ALTER TABLE job_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY tag_access ON job_tags
FOR ALL
USING (
  job_id IN (
    SELECT id FROM jobs 
    WHERE company_id IN (
      SELECT id FROM companies WHERE recruiter_id = auth.uid()
    )
  )
);
```

No changes to application code needed.

---

### Q: How do we migrate from one database to another?

**A:** Supabase provides tools:

```bash
# Export current data
pg_dump $SUPABASE_DATABASE_URL > backup.sql

# Import to new database
psql $NEW_DATABASE_URL < backup.sql
```

Or use Supabase Migration tools (built-in).

---

## Development & Testing Questions

### Q: Should we write tests before or after code?

**A:** TDD (Test-Driven Development) is ideal, but for MVP:

**Priority order:**
1. Core business logic (authService, jobService) - MUST test
2. Critical UI paths (LoginForm, JobCard) - Should test
3. Nice-to-have features - Optional to test

**Reality:** Tests are valuable, but shipping MVP matters most. Test what's critical, add more as time allows.

---

### Q: How do we test RLS policies?

**A:** Sign in as different users, verify queries:

```typescript
// Test as recruiter
const recruiterClient = supabase.createClient(url, anonKey, {
  headers: { 'Authorization': `Bearer ${recruiterToken}` }
});
const companies = await recruiterClient.from('companies').select('*');
expect(companies.length).toBe(1);  // Only their company

// Test as candidate
const candidateClient = supabase.createClient(url, anonKey, {
  headers: { 'Authorization': `Bearer ${candidateToken}` }
});
const companies = await candidateClient.from('companies').select('*');
// Only published companies
expect(companies.every(c => c.is_published)).toBe(true);
```

---

### Q: What's the minimum viable testing coverage?

**A:** For MVP: 70%+ on services, 50%+ on components.

**Critical paths to test:**
- Auth (signup, login, logout)
- Job creation and publishing
- Recruiter dashboard
- Candidate job browsing and filtering

**Nice-to-test:**
- Drag-drop interactions
- Form validation
- Error handling

---

## Interview Preparation Questions

### Q: "Why did you choose Supabase?"

**A:** "Supabase gives us PostgreSQL with multi-tenancy via RLS, built-in Auth, and auto-generated REST API. This eliminates the need for a backend service—I can focus on frontend user experience. Free tier is generous (500MB database, 1GB storage). If we hit limits, upgrading to Pro ($25/month) is straightforward. The big win is RLS: authorization enforced at database level, making it impossible to accidentally leak data even if frontend code is buggy."

---

### Q: "How would you handle concurrency issues?"

**A:** "PostgreSQL handles locking automatically. If two recruiters try to update the same company simultaneously, one is queued. For jobs (independent records), there's no conflict. For complex scenarios (changing someone's role), we'd use Optimistic Locking: add a version field, check it on update, retry if conflict."

---

### Q: "What's a security concern you thought about?"

**A:** "The biggest concern is RLS policies. If a policy is too permissive or has a bug, data could leak. I'd address this by: (1) Writing tests for RLS policies, (2) Using database constraints (UNIQUE, CHECK), (3) Auditing who changed what (created_by, updated_by timestamps), (4) Using soft deletes to preserve history."

---

### Q: "What would you do if you had more time?"

**A:** "In priority order: (1) Job applications with pipeline, (2) Email notifications (Resend), (3) OAuth login (Google), (4) Multi-recruiter per company with roles, (5) Analytics, (6) API for ATS integrations. Each phase builds on previous without breaking changes."

---

## Deployment Questions

### Q: How do we handle secrets in Vercel?

**A:** Environment variables stored in Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Vercel injects at build time
4. Not exposed to client... wait, these ARE public (it's ANON key)

**Important:** Supabase has two keys:
- **Anon key:** Public, limited permissions (in frontend)
- **Service role:** Secret, full permissions (in backend only)

We only use Anon key in React. It's safe because Supabase RLS limits what it can do.

---

### Q: How do we debug live app issues?

**A:** Three levels:

**Browser DevTools:**
- Network tab: see Supabase API calls
- Console: check errors
- React DevTools: inspect component state

**Supabase Dashboard:**
- Logs: see database queries, auth events
- SQL Editor: test queries directly
- Policies: verify RLS policies are correct

**Vercel Logs:**
- Deployments: see build logs
- Functions: see runtime errors

---

**Last Updated:** November 16, 2025

