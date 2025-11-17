# Technical Specification: CareerHub Platform

**Version:** 1.0  
**Last Updated:** November 16, 2025  
**Author:** Suchethan Kummajella

---

## 1. Project Overview

**Project Name:** CareerHub Platform

**Purpose:** A multi-tenant SaaS platform enabling companies to create branded, customizable careers pages with job listings management.

**Core Personas:**
1. **Recruiter** - Creates and customizes company careers pages
2. **Candidate** - Discovers companies and browses job opportunities
3. **ATS Admin** - Platform owner with system-wide access (future)

**Scope:** MVP (6-8 hours development) with planned phases for scaling

---

## 2. Key Features & Requirements

### 2.1 Recruiter Features (MVP)

| Feature | Description | Status |
|---------|-------------|--------|
| Email/Password Auth | Signup and login | Essential |
| Create Company Profile | Set company name and slug | Essential |
| Upload Logo & Banner | Images for branding | Essential |
| Brand Colors | Set primary, secondary, accent colors | Essential |
| Font Selection | Choose from predefined fonts | Essential |
| Mission Statement | Short company description | Essential |
| Content Sections | 6 section types: About, Mission, Life, Perks, Team, FAQs | Essential |
| Drag-Drop Sections | Reorder sections by dragging | Essential |
| Job Management | Create, edit, delete jobs | Essential |
| Live Preview | See careers page while editing | Essential |
| Publish Page | Toggle visibility (is_published) | Essential |
| Copy Link | Get shareable URL | Essential |
| Culture Video | YouTube embed OR direct upload | Planned (P1) |
| OAuth Login | Google, LinkedIn authentication | Planned (P2) |
| Approval Workflow | ATS reviews before publishing | Planned (P2) |
| Draft Jobs | Save jobs without publishing | Planned (P1) |
| Activity Logs | Track who did what and when | Planned (P1) |

### 2.2 Candidate Features (MVP)

| Feature | Description | Status |
|---------|-------------|--------|
| View Careers Page | Access public page by company slug | Essential |
| See Company Info | Logo, banner, branding applied | Essential |
| Browse Jobs | List view of all open jobs | Essential |
| Filter by Location | Filter jobs by location | Essential |
| Filter by Job Type | Filter by full-time, part-time, etc. | Essential |
| Filter by Level | Filter by entry, mid, senior | Essential |
| Search by Title | Full-text search on job title | Essential |
| Job Details Modal | Click job to see full description | Essential |
| Mobile Responsive | Works on all device sizes | Essential |
| Accessibility | WCAG 2.1 AA compliance | Essential |
| SEO Meta Tags | Google can crawl and index | Essential |
| Job Applications | Apply directly in platform | Planned (P2) |

### 2.3 ATS Admin Features (Future - Phase 3)

| Feature | Description | Status |
|---------|-------------|--------|
| System Dashboard | Overview of all companies/jobs | Planned |
| Approval Dashboard | Review pending pages | Planned |
| Analytics | Views, clicks, applications | Planned |
| User Management | Manage recruiters, permissions | Planned |

---

## 3. Database Schema

### 3.1 Core Tables

#### **companies**
Stores company profile and branding configuration.
- `id` (UUID, PK)
- `name` (VARCHAR 255) - Company display name
- `slug` (VARCHAR 255, UNIQUE) - URL-safe identifier
- `recruiter_id` (UUID, FK to auth.users) - Owner of this company
- `logo_url` (VARCHAR 500) - Path to logo in storage
- `banner_url` (VARCHAR 500) - Path to banner in storage
- `primary_color` (VARCHAR 7) - Hex color (#RRGGBB)
- `secondary_color` (VARCHAR 7)
- `accent_color` (VARCHAR 7)
- `font_family` (VARCHAR 100) - 'inter', 'poppins', 'system'
- `mission_statement` (TEXT) - Company description
- `culture_video_url` (VARCHAR 500) - YouTube embed URL or storage path
- `is_published` (BOOLEAN) - Page visibility
- `created_by` (UUID, FK to auth.users) - Who created this record
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `updated_by` (UUID, FK to auth.users) - Last person to update
- **Indexes:** `idx_companies_slug`, `idx_companies_recruiter_id`

#### **jobs**
Stores job postings for companies.
- `id` (UUID, PK)
- `company_id` (UUID, FK to companies) - Which company posted this
- `title` (VARCHAR 255) - Job title
- `description` (TEXT) - Full job description (HTML or plain text)
- `location` (VARCHAR 255) - Job location
- `job_type` (VARCHAR 50) - 'full-time', 'part-time', 'contract', 'internship'
- `salary_min` (DECIMAL 10,2) - Minimum salary (optional)
- `salary_max` (DECIMAL 10,2) - Maximum salary (optional)
- `salary_currency` (VARCHAR 3) - Currency code (USD, INR, etc.)
- `experience_level` (VARCHAR 50) - 'entry', 'mid', 'senior'
- `status` (VARCHAR 50) - 'open', 'closed', 'draft'
- `created_by` (UUID, FK to auth.users)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `updated_by` (UUID, FK to auth.users)
- `deleted_at` (TIMESTAMP, nullable) - Soft delete timestamp
- `is_featured` (BOOLEAN) - Pin to top (planned)
- **Indexes:** `idx_jobs_company_id`, `idx_jobs_company_status`, `idx_jobs_deleted_at`

#### **content_sections**
Stores customizable content sections for company pages.
- `id` (UUID, PK)
- `company_id` (UUID, FK to companies)
- `type` (VARCHAR 100) - 'about', 'mission', 'life', 'perks', 'team', 'faqs'
- `order_index` (INTEGER) - Position for drag-drop ordering
- `is_visible` (BOOLEAN) - Show/hide without deleting
- `title` (VARCHAR 255) - Section title
- `content` (TEXT) - Rich HTML content
- `image_urls` (JSONB) - Array of image URLs for section
- `created_by` (UUID, FK to auth.users)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `updated_by` (UUID, FK to auth.users)
- `deleted_at` (TIMESTAMP, nullable) - Soft delete
- **Indexes:** `idx_content_sections_company_order`, `idx_content_sections_deleted_at`

#### **faqs**
Stores frequently asked questions for company pages.
- `id` (UUID, PK)
- `company_id` (UUID, FK to companies)
- `question` (TEXT)
- `answer` (TEXT)
- `order_index` (INTEGER)
- `created_by` (UUID, FK to auth.users)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `updated_by` (UUID, FK to auth.users)
- `deleted_at` (TIMESTAMP, nullable) - Soft delete
- **Indexes:** `idx_faqs_company_order`, `idx_faqs_deleted_at`

#### **video_uploads** (Planned)
Stores metadata for uploaded videos.
- `id` (UUID, PK)
- `company_id` (UUID, FK to companies)
- `file_name` (VARCHAR 255)
- `file_size` (INTEGER) - In bytes
- `mime_type` (VARCHAR 100) - 'video/mp4', etc.
- `storage_path` (VARCHAR 500) - Path in Supabase Storage
- `duration` (INTEGER) - Video length in seconds
- `upload_status` (VARCHAR 50) - 'completed', 'processing', 'failed'
- `created_at` (TIMESTAMP)

### 3.2 Audit Trail Pattern

All tables include:
- `created_by` (who created this record)
- `updated_by` (who last modified)
- `created_at` (when created)
- `updated_at` (when modified)
- `deleted_at` (when soft deleted, NULL if active)

This allows tracking "who did what and when" without losing historical data.

### 3.3 Multi-Tenancy via Slugs

Each company identified by unique `slug`:
```
tech-corp-india → careers page at /tech-corp-india/careers
design-studio-co → careers page at /design-studio-co/careers
```

Slugs are URL-safe, user-friendly, and globally unique.

---

## 4. Authorization Model: Row Level Security (RLS)

### 4.1 How RLS Works

Instead of application-level RBAC with permission tables, we use PostgreSQL's built-in Row Level Security:

```sql
-- Recruiter can only see/modify their own company
CREATE POLICY recruiter_company_access ON companies
FOR ALL
USING (recruiter_id = auth.uid())
WITH CHECK (recruiter_id = auth.uid());

-- Candidate can only see published companies
CREATE POLICY candidate_company_access ON companies
FOR SELECT
USING (is_published = TRUE);
```

**Key Points:**
- Each database query automatically filtered at the row level
- No backend logic needed - PostgreSQL enforces permissions
- Every INSERT/UPDATE/DELETE checked against policy
- Much more secure than application-level checks

### 4.2 Persona-Specific Access

| Persona | Companies Access | Jobs Access | Sections Access |
|---------|------------------|-------------|-----------------|
| **Recruiter** | Own company only | Own company's jobs | Own company's sections |
| **Candidate** | Published companies only | Published companies' open jobs | Published companies' visible sections |
| **ATS Admin** (Future) | All companies (via backend) | All jobs (via backend) | All content (via backend) |

### 4.3 Scaling RLS as New Personas Added

As you add new roles in the future:

**Option 1: Add Role Column to auth.users**
```sql
ALTER TABLE auth.users ADD COLUMN role VARCHAR(50) DEFAULT 'candidate';
-- Then update policies to check this role
```

**Option 2: Create Permissions Lookup Table**
```sql
CREATE TABLE user_roles (
  user_id UUID REFERENCES auth.users(id),
  company_id UUID REFERENCES companies(id),
  role VARCHAR(50),  -- 'recruiter', 'hiring_manager', 'reviewer'
  UNIQUE(user_id, company_id)
);

-- Policy checks this table
CREATE POLICY multi_role_access ON jobs
FOR ALL
USING (
  company_id IN (
    SELECT company_id FROM user_roles 
    WHERE user_id = auth.uid()
  )
);
```

Both approaches work well and don't require schema rewrites.

---

## 5. API Endpoints

### 5.1 Auto-Generated Supabase REST API

Supabase provides auto-generated REST endpoints:

```
POST   /rest/v1/auth/v1/signup              # Create account
POST   /rest/v1/auth/v1/signin              # Login
POST   /rest/v1/auth/v1/logout              # Logout

GET    /rest/v1/companies?slug=eq.XXX       # Fetch company by slug
POST   /rest/v1/companies                   # Create company
PATCH  /rest/v1/companies/{id}              # Update company
DELETE /rest/v1/companies/{id}              # Delete (soft)

GET    /rest/v1/jobs?company_id=eq.XXX      # Fetch jobs
POST   /rest/v1/jobs                        # Create job
PATCH  /rest/v1/jobs/{id}                   # Update job
DELETE /rest/v1/jobs/{id}                   # Delete (soft)

GET    /rest/v1/content_sections?...        # Fetch sections
POST   /rest/v1/content_sections            # Create section
PATCH  /rest/v1/content_sections/{id}       # Update section
DELETE /rest/v1/content_sections/{id}       # Delete (soft)
```

All endpoints respect RLS policies automatically.

### 5.2 Custom RPC Functions

For complex operations, we can use Supabase RPC functions:

```sql
-- Reorder sections atomically
CREATE OR REPLACE FUNCTION reorder_sections(
  p_company_id UUID,
  p_sections_data JSONB
)
RETURNS JSON AS $$
BEGIN
  -- Update order_index for each section
  -- Transaction ensures atomic update
  RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check RLS context (who is calling)
CREATE POLICY rpc_reorder_policy
ON content_sections
FOR ALL
USING (
  company_id IN (
    SELECT id FROM companies 
    WHERE recruiter_id = auth.uid()
  )
);
```

---

## 6. Filtering Strategy

### 6.1 Client-Side Filtering (Current MVP)

Jobs are relatively small dataset (<1000 per company typically), so we:
- Fetch all open jobs from company
- Filter in React (location, type, level)
- Search with JavaScript string matching

```typescript
const filtered = jobs.filter(job => 
  (selectedLocation ? job.location === selectedLocation : true) &&
  (selectedType ? job.job_type === selectedType : true) &&
  (selectedLevel ? job.experience_level === selectedLevel : true) &&
  (searchTerm ? job.title.toLowerCase().includes(searchTerm) : true)
);
```

**Pros:** Simple, no extra queries, fast for small datasets  
**Cons:** Doesn't scale to millions of jobs

### 6.2 Server-Side Filtering (For Large Datasets - Phase 2)

When dataset grows, implement server-side filtering:

```typescript
// Fetch only filtered jobs from Supabase
const { data: jobs } = await supabase
  .from('jobs')
  .select('*')
  .eq('company_id', companyId)
  .eq('status', 'open')
  .eq('location', selectedLocation)      // DB-level filter
  .eq('job_type', selectedType)          // DB-level filter
  .eq('experience_level', selectedLevel) // DB-level filter
  .ilike('title', `%${searchTerm}%`);    // Full-text search
```

We'll add database indexes to make these queries fast:
```sql
CREATE INDEX idx_jobs_filters ON jobs(company_id, status, location, job_type, experience_level);
```

**Transition Strategy:** Start with client-side (MVP), switch to server-side when dataset grows (no code breaks, just query method changes).

---

## 7. Audit Trail Implementation

Every action tracked with:
- **WHO**: `created_by`, `updated_by` (user IDs)
- **WHEN**: `created_at`, `updated_at` (timestamps)
- **WHAT**: Soft deletes via `deleted_at` timestamp

**Example Query to See Audit History:**
```sql
SELECT 
  id, title, 
  created_by, created_at,
  updated_by, updated_at,
  deleted_at,
  CASE 
    WHEN deleted_at IS NOT NULL THEN 'deleted'
    WHEN updated_at > created_at THEN 'modified'
    ELSE 'created'
  END as action
FROM jobs
WHERE company_id = 'xxx'
ORDER BY updated_at DESC;
```

---

## 8. Testing Strategy

### 8.1 Unit Tests

Test individual functions in isolation:

```typescript
// authService.test.ts
test('signUp creates user and returns JWT', async () => {
  const result = await signUp('test@example.com', 'password123');
  expect(result.user).toBeDefined();
  expect(result.session).toBeDefined();
});

test('signIn fails with wrong password', async () => {
  const result = await signIn('test@example.com', 'wrongpass');
  expect(result.error).toBeDefined();
});

// jobService.test.ts
test('getJobs filters by company_id via RLS', async () => {
  const jobs = await getJobs(companyId);
  expect(jobs).toBeInstanceOf(Array);
  expect(jobs.every(j => j.company_id === companyId)).toBe(true);
});

test('createJob adds created_by audit field', async () => {
  const job = await createJob(companyId, { title: 'Engineer' });
  expect(job.created_by).toBeDefined();
  expect(job.created_at).toBeDefined();
});
```

**Target:** 70%+ coverage on services layer

### 8.2 Component Tests

Test UI interactions:

```typescript
// LoginForm.test.tsx
test('renders email and password fields', () => {
  const { getByLabelText } = render(<LoginForm />);
  expect(getByLabelText(/email/i)).toBeInTheDocument();
  expect(getByLabelText(/password/i)).toBeInTheDocument();
});

test('calls signIn on form submit', async () => {
  const mockSignIn = vi.fn();
  const { getByRole } = render(<LoginForm onSubmit={mockSignIn} />);
  
  await userEvent.type(getByLabelText(/email/i), 'test@example.com');
  await userEvent.type(getByLabelText(/password/i), 'password123');
  await userEvent.click(getByRole('button', { name: /login/i }));
  
  expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
});

// JobCard.test.tsx
test('displays job title, location, and type', () => {
  const job = { title: 'Engineer', location: 'Remote', job_type: 'full-time' };
  const { getByText } = render(<JobCard job={job} />);
  expect(getByText('Engineer')).toBeInTheDocument();
  expect(getByText('Remote')).toBeInTheDocument();
  expect(getByText('full-time')).toBeInTheDocument();
});

test('opens job detail modal on click', async () => {
  const job = { id: '1', title: 'Engineer' };
  const { getByRole, queryByText } = render(<JobCard job={job} />);
  
  await userEvent.click(getByRole('button'));
  expect(queryByText(/full job description/i)).toBeInTheDocument();
});
```

**Target:** 50%+ coverage on components (focus on critical paths)

### 8.3 Integration Tests

Test complete user flows:

```typescript
// auth.integration.test.ts
test('recruiter signup → create company → publish flow', async () => {
  // 1. Sign up
  const user = await signUp('recruiter@company.com', 'password123');
  expect(user.id).toBeDefined();
  
  // 2. Create company
  const company = await createCompany({
    name: 'Tech Corp',
    slug: 'tech-corp'
  });
  expect(company.slug).toBe('tech-corp');
  
  // 3. Add job
  const job = await createJob(company.id, {
    title: 'Engineer',
    description: 'Full-stack engineer'
  });
  expect(job.status).toBe('open');
  
  // 4. Publish
  const published = await publishCompany(company.id);
  expect(published.is_published).toBe(true);
  
  // 5. Candidate can now see it
  const publicCompany = await getPublicCompany('tech-corp');
  expect(publicCompany.is_published).toBe(true);
});
```

---

## 9. Security Considerations

### 9.1 Authentication

- Passwords hashed with bcrypt (Supabase Auth handles this)
- JWTs signed and validated by Supabase
- Tokens stored in HttpOnly cookies (inaccessible to JavaScript)
- Auto-refresh tokens every hour
- HTTPS enforced (no HTTP)

### 9.2 Authorization

- RLS policies at database level (can't bypass)
- Every query scoped to current user
- All data isolation enforced by PostgreSQL
- No application-level permission checks (unnecessary, DB enforces)

### 9.3 File Uploads

- Whitelist MIME types: `image/jpeg`, `image/png`, `video/mp4`
- Max file sizes: 5MB for images, 50MB for videos
- Virus scanning optional (future: integrate ClamAV)
- Files stored in Supabase Storage (not public until explicitly exposed)
- CDN serves files through Supabase (no direct bucket access)

### 9.4 CORS & API Security

- Supabase handles CORS automatically
- API keys scoped to specific operations
- Anon key has limited permissions (only select from published data)
- Service role key (for backend) has full access (never exposed to frontend)

---

## 10. Performance Considerations

### 10.1 Database Optimization

**Indexes created for:**
- Company lookups by slug: `idx_companies_slug`
- Recruiter's companies: `idx_companies_recruiter_id`
- Company's jobs: `idx_jobs_company_id`
- Job filtering: `idx_jobs_company_status`, `idx_jobs_filters`
- Soft deletes: `idx_jobs_deleted_at` (exclude deleted records)

**Query optimization:**
```sql
-- Bad: N+1 queries
SELECT * FROM companies; -- fetches 100
-- Then for each company, SELECT * FROM jobs;

-- Good: Single query with join
SELECT c.*, json_agg(j.*) as jobs
FROM companies c
LEFT JOIN jobs j ON j.company_id = c.id
GROUP BY c.id;
```

### 10.2 Frontend Optimization

- Code splitting by route (lazy load pages)
- Image optimization (compression, CDN caching)
- Component memoization (avoid re-renders)
- Virtual scrolling for large job lists (future)

---

## 11. Known Limitations & Future Work

| Limitation | Impact | When to Fix |
|-----------|--------|-----------|
| No job applications | MVP focused on browsing | Phase 2 |
| Single recruiter per company | Simplifies MVP model | Phase 3 |
| No email notifications | Manual tracking only | Phase 2 |
| Client-side filtering only | Works for <1000 jobs | Scale Phase |
| No analytics | Blind on usage metrics | Phase 3 |
| 500MB DB free tier limit | Rarely hit, huge buffer | Pro tier ($25/mo) |
| No OAuth login | Email only, simpler MVP | Phase 2 |
| No approval workflow | Recruiters publish directly | Phase 2 |

---

## 12. Definitions

- **Slug:** URL-safe unique identifier (e.g., `tech-corp-india`)
- **RLS:** Row Level Security - PostgreSQL feature for data isolation
- **Soft Delete:** Mark as deleted (`deleted_at` timestamp) instead of removing from database
- **Audit Trail:** Record of who did what and when (created_by, updated_by, timestamps)
- **Multi-Tenancy:** Multiple companies (tenants) isolated in one database
- **JWT:** JSON Web Token - Secure way to pass user identity
- **RBAC:** Role-Based Access Control - Traditional permission system with roles & permissions
- **SEO:** Search Engine Optimization - Making page crawlable by Google

