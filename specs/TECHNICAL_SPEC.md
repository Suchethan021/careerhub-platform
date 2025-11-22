# Technical Specification: CareerHub Platform

**Author:** Suchethan Kummajella  
**Date:** November 16-22, 2025  
**Time Spent:** ~20 hours

---

## What I Built

A career page builder where companies can create their own branded careers pages with job listings. Think "mini Greenhouse/Lever" but simpler and focused on the public-facing page.

**Two main users:**
- **Recruiters** - Create company pages, post jobs
- **Candidates** - Browse companies, view jobs

**Tech Stack:**
- Frontend: React 18 + TypeScript + Vite + TailwindCSS
- Backend: Supabase (PostgreSQL + Auth + Storage)
- Deployment: Vercel
- Tools: Windsurf (70%), Perplexity (25%), Cursor (3%), Manual (2%)

---

## Core Features

### What Recruiters Can Do:
- ✅ Sign up / Login with email
- ✅ Create company profile with slug (e.g., `/tech-corp/careers`)
- ✅ Upload logo and banner (< 5MB)
- ✅ Pick brand colors (primary, secondary, accent)
- ✅ Choose font (Inter, Roboto, Poppins, etc.)
- ✅ Add mission statement
- ✅ Add 6 types of content sections: About, Mission, Life at Company, Perks, Team, FAQs
- ✅ Reorder sections with drag-drop
- ✅ Post jobs (title, description, location, type, salary range)
- ✅ Edit/delete jobs
- ✅ Publish/unpublish careers page
- ✅ Copy shareable link
- 🟡 Culture video (YouTube embed working, direct upload planned)

### What Candidates Can Do:
- ✅ View public careers pages at `/company-slug/careers`
- ✅ See company branding (logo, colors, fonts applied)
- ✅ Browse all jobs
- ✅ Filter by location, job type, level
- ✅ Search by job title
- ✅ Click to see full job details
- ✅ Responsive on mobile

### What's Not Built Yet:
- ❌ Job applications (candidates can't apply yet)
- ❌ Multiple recruiters per company (1 recruiter = 1 company for now)
- ❌ Email notifications
- ❌ Analytics dashboard
- ❌ OAuth login (Google/LinkedIn)

---

## Database Schema

I designed 4 main tables in PostgreSQL:

### `companies`
Stores company profile and branding.
```sql
- id (UUID)
- name (company name)
- slug (URL identifier - unique)
- recruiter_id (who owns this company)
- logo_storage_path (Supabase Storage path)
- banner_storage_path (Supabase Storage path)
- primary_color, secondary_color, accent_color (hex codes)
- font_family (inter, roboto, etc.)
- mission_statement (text)
- culture_video_youtube_url (optional)
- culture_video_upload_path (optional)
- is_published (boolean - show to public?)
- created_at, updated_at, created_by, updated_by
```

### `jobs`
Stores job postings.
```sql
- id (UUID)
- company_id (which company)
- title, description, location
- job_type (full-time, part-time, contract, internship)
- work_mode (remote, hybrid, onsite)
- salary_range (text - e.g., "₹15L - ₹25L")
- required_skills (text array)
- is_published (boolean)
- created_at, updated_at, deleted_at (soft delete)
```

### `content_sections`
Custom content blocks for careers page.
```sql
- id (UUID)
- company_id
- section_type (about, mission, life, perks, team, custom)
- title, content (text/HTML)
- order_index (for drag-drop)
- is_visible (show/hide)
- created_at, updated_at, deleted_at
```

### `faqs`
Frequently asked questions.
```sql
- id (UUID)
- company_id
- question, answer (text)
- order_index
- created_at, updated_at, deleted_at
```

**Why soft deletes?**  
I use `deleted_at` timestamp instead of actually deleting records. This way:
- Can undo deletions later
- Preserves audit history
- Required for some compliance needs

---

## Security: Row Level Security (RLS)

Instead of building a traditional RBAC system with roles and permissions tables, I used PostgreSQL's built-in Row Level Security.

**How it works:**
- Database enforces who can see/edit what
- No backend permission checks needed
- Every query automatically filtered

**Example policies:**
```sql
-- Recruiter can only see their own company
CREATE POLICY recruiter_access ON companies
FOR ALL
USING (recruiter_id = auth.uid());

-- Public can only see published companies
CREATE POLICY public_access ON companies
FOR SELECT
USING (is_published = TRUE);
```

**Why I chose RLS over RBAC:**
- Simpler for MVP (no roles/permissions tables)
- More secure (database-level, can't bypass)
- Easier to reason about
- Supabase makes it easy

**Trade-off:**  
Harder to add complex multi-user permissions later. But for MVP where 1 recruiter = 1 company, it's perfect.

---

## File Upload & Storage

**Where files go:**  
Supabase Storage bucket called `company-assets`

**What I upload:**
- Logos (max 5MB, jpg/png)
- Banners (max 5MB, jpg/png)
- Videos (max 50MB, mp4)

**How it works:**
1. User selects file
2. Frontend uploads to Supabase Storage
3. Get storage path (e.g., `user-id/logo.png`)
4. Save path to database
5. Display: Convert path to public URL using `getPublicUrl()`

**Storage policies:**
- Public can read (so careers pages can display images)
- Only authenticated users can upload
- Each user uploads to their own folder (`user-id/`)

---

## Filtering Jobs

**Current approach (MVP): Client-side filtering**

I fetch ALL jobs for a company (usually <100 jobs) and filter in React:

```typescript
const filtered = jobs.filter(job => 
  (location ? job.location === location : true) &&
  (type ? job.job_type === type : true) &&
  (search ? job.title.toLowerCase().includes(search) : true)
);
```

**Why client-side?**
- Simple to implement
- Fast for small datasets
- No extra database queries
- Most companies have <100 jobs anyway

**When to switch to server-side?**  
When companies have 1000+ jobs, I'll move filtering to database with proper indexes. Won't break existing code, just change where filtering happens.

---

## SEO Setup

**What's configured:**
- ✅ Meta tags (title, description) on all pages
- ✅ Open Graph tags for social sharing
- ✅ Sitemap generated at `/sitemap.xml`
- ✅ Robots set to `noindex, nofollow` (if we just set it to index, follow it will allow crawling, i have done it intentionally not to crawl and index for the time being as its not a fully ready appliation and the url might change with a custom domain this is the default domain i'm using)
- ✅ Clean URLs with company slug (no hash routing)
- ✅ Semantic HTML (h1, h2, proper tags)

**What needs to be done after deployment:**
1. Submit sitemap to Google Search Console (we can generate at sitemapgenerator site and just share the website url it will create sitemap we can adjust priorities and save and submit)
2. Submit sitemap to Bing Webmaster Tools
3. Verify domain ownership
4. Monitor indexing status

**Why important:**  
So candidates can find careers pages through Google search.

---

## Testing

I did mostly manual testing. I wrote test scripts initially but due to time constraints i didnt expand those.

**What I tested:**

**Recruiter flow:**
- [x] Signup with email
- [x] Email verification
- [x] Login / Logout
- [x] Create company profile
- [x] Upload logo (< 5MB) ✅
- [x] Upload logo (> 5MB) - shows error ✅
- [x] Upload banner
- [x] Pick colors
- [x] Add mission statement
- [x] Create job
- [x] Edit job
- [x] Delete job
- [x] Add FAQ
- [x] Add content section
- [x] Reorder sections
- [x] Publish page
- [x] View careers page
- [x] Logo displays ✅ (fixed bug)
- [x] Banner displays ✅ (fixed bug)

**Candidate flow:**
- [x] View careers page without login
- [x] Browse jobs
- [x] Filter by location
- [x] Filter by job type
- [x] Search by title
- [x] View job details
- [x] Responsive on mobile

**Edge cases:**
- [x] Duplicate slug error
- [x] Wrong file format
- [x] Network failure
- [x] Session refresh

**Not tested yet:**
- Load testing (how many concurrent users?)
- XSS/SQL injection attempts
- Very long job descriptions
- Accessibility with screen readers

---

## Problems I Hit & How I Fixed Them

### Problem 1: File Upload Not Actually Uploading

**What happened:**  
User uploads logo → looks good in preview → saves form → refresh page → logo gone!

**Root cause:**  
`FileUpload` component created blob URLs (`blob:http://...`) instead of actually uploading to Supabase Storage. Blob URLs expire when page refreshes.

**How I fixed it:**
1. Updated `FileUpload.tsx` to actually call `storageService.uploadFile()`
2. Return storage path (not blob URL)
3. Save path to database

**Tool used:** Perplexity helped me debug, Windsurf implemented fix

**Time spent:** 2 hours total (discovering + fixing)

---

### Problem 2: Images Upload But Don't Show

**What happened:**  
Logo and banner successfully upload to Supabase Storage (I can see them in Storage bucket), but careers page shows broken image placeholders.

**Root cause:**  
Database saved storage PATH (`user-id/logo.png`) but frontend tried to display path directly as URL. Storage path isnt public URL.

**How I fixed it:**
1. Created `getPublicUrl()` helper in `storageService.ts`
2. Convert storage path to public URL before displaying
3. Updated `CareersPage.tsx` to use converted URLs

**Tool used:** Perplexity identified issue, I implemented manually

**Time spent:** 1 hour

**Key learning:**  
Storage path is internal reference. Always convert to public URL for display.

---

### Problem 3: Content Sections Duplicate Error

**What happened:**  
User tries to save "Mission" section → Silent failure → Check console → Database error:
```
duplicate key value violates unique constraint "unique_section_per_company"
```

**Root cause:**  
Database has unique constraint: one company can't have multiple "mission" sections. But form tried to INSERT without checking if section already exists.

**How I fixed it:**
Changed INSERT to UPSERT:
```sql
INSERT INTO content_sections (...)
VALUES (...)
ON CONFLICT (company_id, section_type) 
DO UPDATE SET title = ..., content = ...;
```

**Tool used:** Perplexity suggested upsert approach, I implemented in `contentSectionService.ts`

**Time spent:** 30 minutes

---

### Problem 4: RLS Policy Hell

**What happened:**  
Spent 2 hours trying to upload images. Got generic "upload failed" error with no details.

**Root cause:**  
Storage bucket had wrong RLS policy. Authenticated users couldn't upload.

**How I fixed it:**
```sql
CREATE POLICY authenticated_upload ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'company-assets');
```

**Tool used:** Googled "supabase storage upload failed authenticated", found similar issues

**Time spent:** 2 hours

**Key learning:**  
Always test storage policies separately before integrating with frontend.

---

### Problem 5: Silent Error Handling

**What happened:**  
Errors happening but user sees nothing. Everything looks fine but data isn't saved.

**Examples:**
- Upload fails → no indication
- Save fails → form just doesn't submit
- Database error → logged to console but user has no clue

**How I fixed it:**
1. Created `ErrorAlert.tsx` component (visual error display with icon)
2. Created `errorHandler.ts` utility (converts database errors to friendly messages)
3. Updated all forms to show `ErrorAlert` on error
4. Parse specific error codes:
   - `23505` (duplicate) → "This already exists"
   - `23503` (foreign key) → "Related record not found"
   - File errors → "File too large" / "Invalid format"

**Tool used:** Perplexity designed error system, Windsurf implemented

**Time spent:** 1 hour

**Key learning:**  
Always show user-friendly errors. Database error codes mean nothing to users.

---

## Architecture Decisions & Trade-offs

### Why Supabase?

**Chose Supabase over:**
- Firebase - wanted PostgreSQL not Firestore
- Custom backend - too much work for MVP
- AWS - more complex setup

**Reasons:**
- All-in-one: database + auth + storage + realtime
- PostgreSQL (powerful relational database)
- RLS for security (no backend needed)
- Free tier generous (500MB DB, 1GB storage)
- Great docs and DX

**Trade-offs:**
- Vendor lock-in (hard to migrate away)
- Less control than custom backend
- Free tier limits (need paid plan at scale)

**Would I choose it again?** Yes. Saved weeks of backend work.

---

### Why Single Recruiter Per Company?

**For MVP, I decided:**
- 1 recruiter = 1 company
- No multi-user support
- No permissions/roles

**Reasons:**
- Simpler data model (no `user_roles` table)
- Most startups have 1 recruiter anyway
- Can add multi-user later without breaking schema
- Focus on core features first

**How to scale later:**
Add `user_roles` table:
```sql
CREATE TABLE user_roles (
  user_id UUID REFERENCES auth.users,
  company_id UUID REFERENCES companies,
  role VARCHAR (admin, editor, viewer)
);
```

**Trade-off:** Can't have multiple people managing same company page.

---

### Why Client-Side Filtering?

**Current setup:**
- Fetch ALL jobs for company
- Filter in React with JavaScript

**Reasons:**
- Most companies have <100 jobs
- Simpler implementation
- Faster (fetch once, filter instantly)
- No database queries on every filter change

**When to switch to server-side:**
- Company has 1000+ jobs
- Search needs to be smarter (full-text, fuzzy)
- Add pagination

**Trade-off:** Won't scale to huge job boards. But fine for MVP.

---

### Why Soft Deletes?

**Instead of:**
```sql
DELETE FROM jobs WHERE id = 'xxx';  -- Gone forever
```

**I do:**
```sql
UPDATE jobs SET deleted_at = NOW() WHERE id = 'xxx';  -- Marked deleted
```

**Reasons:**
- Can undo deletions (add "restore" feature later)
- Preserves audit history
- Some companies need data retention for compliance
- Still looks deleted to users (`WHERE deleted_at IS NULL`)

**Trade-off:**  
- Need to remember `deleted_at IS NULL` in every query
- Database grows larger over time
- Periodically need to archive really old deleted records

---

## What I'd Do Differently

### If I Started Over:

**Would keep:**
- ✅ Supabase (saved massive time)
- ✅ TypeScript (caught many bugs early)
- ✅ RLS over RBAC (simpler, more secure)
- ✅ TailwindCSS (fast styling)
- ✅ Vite (fast builds)

**Would change:**
- ❌ Test file upload immediately (caught bug late in development)
- ❌ Build error handling from day 1 (added as afterthought)
- ❌ Design mobile-first from start (added responsive later)
- ❌ Use database migrations (currently manual SQL setup)
- ❌ Add automated tests (only manual testing)

---


### Nice to have:**
- [ ] Analytics dashboard
- [ ] Job application system
- [ ] Multi-user support per company
- [ ] OAuth login (Google, LinkedIn)
- [ ] Email templates for branding
- [ ] Dark mode

---

## Performance Considerations

**Database indexes created:**
```sql
CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_deleted_at ON jobs(deleted_at);
CREATE INDEX idx_content_sections_company ON content_sections(company_id, order_index);
```

**Why these indexes?**
- `slug` - lookup company by URL (most common query)
- `company_id` - fetch all jobs for a company
- `deleted_at` - exclude deleted records efficiently
- `order_index` - sort sections in order

**Frontend optimization:**
- Code splitting by route (lazy load pages)
- Images from Supabase CDN (cached, compressed)
- React.memo for expensive components
- Debounce search input (don't filter on every keystroke)

---

## Known Limitations

| What's Missing | Why | Plan |
|---------------|-----|------|
| Job applications | MVP focused on browsing | Add in Phase 2 with email system |
| Multi-user per company | Simplified MVP | Add user_roles table later |
| Email notifications | No email service yet | Integrate SendGrid/Resend |
| Analytics | Blind on usage stats | Add Google Analytics + custom dashboard |
| OAuth login | Email auth simpler | Add social login buttons later |
| Server-side filtering | Works for <1000 jobs | Switch when dataset grows |
| Approval workflow | Recruiters publish directly | Add approval queue later |

---

## Definitions

**Slug:** URL-safe company identifier (e.g., `tech-corp-india`)  
**RLS:** Row Level Security - PostgreSQL feature that filters data at database level  
**Soft Delete:** Mark as deleted with timestamp instead of removing from database  
**JWT:** JSON Web Token - How user identity is passed securely  
**Blob URL:** Temporary local file URL (like `blob:http://...`) - expires on refresh

---

## Time Breakdown

**Total time:** ~15 to 20 hours over 6 days

- Planning & architecture: 2 hours
- Database design: 2 hours
- Authentication system: 4 hours
- Recruiter dashboard: 5 hours
- Public careers pages: 4 hours
- Marketing pages: 2 hours
- Bug fixes & polish: 4 hours
- Documentation: 1 hour


---

## Conclusion

Built a working MVP in a week using AI tools heavily. Supabase + React + Vercel stack worked great for rapid prototyping. Main learnings: test file uploads early, build error handling from start, RLS is powerful but takes time to understand.

**What works:** Recruiters can create branded careers pages, post jobs, candidates can browse.

**What's next:** Add job applications, email notifications, analytics, multi-user support.

---

**Questions or issues?** go through the docs, 
/docs folder for functional and doubts and clarifications 
/specs folder for technical specification docs

check the code or reach out! 
