# Requirements Tracking: MVP vs Planned vs Added Features

Track what was built from the assignment requirements vs what we added vs what's planned for future.

---

## Assignment Requirements (From careerspage.txt)

### What the Assignment Asked For

**Recruiter Features:**
- ✅ Set brand theme (colors, banner, logo, culture video)
- ✅ Add, remove, or reorder content sections (About Us, Life at Company, etc.)
- ✅ Preview how page will look before publishing
- ✅ Save settings — each company's data stored separately
- ✅ Share their company's public Careers link

**Candidate Features:**
- ✅ Learn about company through Careers page
- ✅ Browse open jobs with filters (Location, Job Type)
- ✅ Search by Job Title
- ✅ Clean, mobile-friendly, accessible UI
- ✅ SEO-ready page (crawlable HTML, meta tags, structured data)
- ✅ **Don't** need to build job application flow

**Technical:**
- ✅ Multi-company support (each company separate data)
- ✅ Sample data for testing
- ✅ Production deployment

---

## Essential Features (MVP - Core Functionality)

These features are required to meet assignment requirements.

### Authentication & Company Management
- [x] Email/password signup and login
- [x] Create company profile (name, slug)
- [x] Multi-company support (data isolation)
- [x] Company profiles are separate (one recruiter per company in MVP)

### Branding & Customization
- [x] Upload logo image
- [x] Upload banner image
- [x] Set 3 brand colors (primary, secondary, accent)
- [x] Select font family
- [x] Add mission statement/description

### Content Sections
- [x] 6 predefined section types (About, Mission, Life, Perks, Team, FAQs)
- [x] Add sections to page
- [x] Remove sections
- [x] Reorder sections (drag-and-drop)
- [x] Edit section content
- [x] Hide/show sections

### Job Management
- [x] Create job postings
- [x] Edit job details (title, description, location, type, salary, level)
- [x] Delete jobs
- [x] List jobs for company
- [x] Filter jobs by status (open, closed, draft)

### Preview & Publishing
- [x] Live preview of careers page while editing
- [x] Publish page (make visible to candidates)
- [x] Unpublish page (hide from public)
- [x] Generate and copy shareable link

### Public Careers Page
- [x] View by company slug (/:company-slug/careers)
- [x] Display company branding (logo, banner, colors, font)
- [x] Display content sections in order
- [x] List open jobs
- [x] Filter jobs by location
- [x] Filter jobs by job type
- [x] Search jobs by title
- [x] Click job to see details
- [x] Mobile responsive design
- [x] Keyboard accessible
- [x] Screen reader compatible

### SEO & Crawlability
- [x] Meta tags (title, description, og:image)
- [x] Structured data (JSON-LD)
- [x] Semantic HTML
- [x] Crawlable by Google

### Testing & Quality
- [x] Unit tests on services
- [x] Component tests on critical UI
- [x] Integration tests on core flows
- [x] Code follows best practices
- [x] TypeScript strict mode

### Documentation & Submission
- [x] GitHub repo with working code
- [x] Production deployed link
- [x] Tech Spec with assumptions and architecture
- [x] README with setup instructions
- [x] Sample data included
- [x] Demo video (≤5 min)

---

## Basic Features (Nice-to-Have for MVP)

These features enhance MVP but aren't strictly required.

### Enhanced UX
- [x] Loading states (spinners, skeletons)
- [x] Error handling with user-friendly messages
- [x] Form validation
- [x] Toast/notification system
- [x] Confirmation dialogs for destructive actions

### Media Handling
- [ ] Culture video upload support (hybrid with YouTube embed)
- [ ] Image optimization and compression
- [ ] Multiple images per section (gallery)

### Advanced Filtering
- [x] Filter by experience level
- [ ] Multi-select filtering
- [ ] Filter combinations (e.g., location AND type)
- [ ] Sort options (newest, salary, relevance)

### Analytics (Planned Phase 2)
- [ ] Page view tracking
- [ ] Job click tracking
- [ ] Application source tracking
- [ ] Heatmap of interactions

### Admin Features
- [ ] View all companies
- [ ] View all jobs
- [ ] User management
- [ ] Activity logs

---

## Planned/Advanced Features (Phase 2+)

Features deferred for future phases to keep MVP scope focused.

### Phase 2: Job Applications & Candidate Pipeline

**Why deferred:** Job applications add 2-3 hours of development. MVP demonstrates core value (browsing experience). Applications add complexity without changing core architecture.

- [ ] Job application form
- [ ] Resume/CV upload
- [ ] Cover letter field
- [ ] Application tracking dashboard
- [ ] Application status (new, reviewed, rejected, accepted)
- [ ] Email notifications for applications
- [ ] Bulk candidate actions

### Phase 2: Enhanced Authentication

- [ ] OAuth login (Google, LinkedIn)
- [ ] Magic link authentication
- [ ] Social login options
- [ ] Two-factor authentication (2FA)
- [ ] Session management

### Phase 2: Communication

- [ ] Email notifications for applications
- [ ] Email templates customization
- [ ] In-app notifications/messaging
- [ ] Job alert subscriptions
- [ ] Candidate email campaign

### Phase 3: Multi-Team & Collaboration

- [ ] Multiple recruiters per company
- [ ] Different roles (Recruiter, Hiring Manager, Reviewer)
- [ ] Approval workflows (draft → review → publish)
- [ ] Team permissions
- [ ] Activity audit logs with timestamps

### Phase 3: Admin Dashboard (ATS)

- [ ] View all companies
- [ ] Review pending pages for approval
- [ ] Company statistics
- [ ] Job statistics
- [ ] User management
- [ ] System configuration

### Phase 3: Analytics & Insights

- [ ] Page analytics (views, time on page)
- [ ] Job analytics (views, applications)
- [ ] Traffic sources
- [ ] Device/browser breakdown
- [ ] Funnel analysis
- [ ] Reports and exports

### Phase 4: Marketplace & Monetization

- [ ] Premium templates
- [ ] Advanced branding options
- [ ] Custom CSS support
- [ ] Custom domain support
- [ ] API access for integrations
- [ ] Zapier integration
- [ ] ATS integrations (Workable, Lever, etc.)
- [ ] Billing and subscription management

### Phase 4: Advanced Candidates

- [ ] Candidate profiles
- [ ] CV/resume parsing
- [ ] Job recommendations based on profile
- [ ] Candidate search and matching
- [ ] Interview scheduling
- [ ] Skill assessments
- [ ] Background checks integration

### Future: AI/ML Features

- [ ] Job description generation (AI)
- [ ] Resume screening (ML)
- [ ] Candidate matching (ML)
- [ ] Salary recommendation (ML)
- [ ] Cultural fit scoring

---

## Features We Added Beyond Assignment

Beyond the assignment requirements, we added these features for robustness and learning:

### Audit Trail
- Created by / Updated by / Deleted at tracking
- Who did what and when
- Soft deletes (preserve data history)

**Why added:** Essential for compliance, debugging, and professional systems. Teaches audit patterns.

### Database Indexes
- Indexed company_id, recruiter_id, status, deleted_at
- Optimized for filtering and pagination

**Why added:** Teaches database optimization. Prevents N+1 query problems.

### RLS Policies
- Multi-level authorization at database level
- Can't bypass with code errors

**Why added:** More secure than application-level checks. Industry standard for multi-tenant SaaS.

### TypeScript Strict Mode
- All types explicitly defined
- No `any` types
- Compiler catches type mismatches

**Why added:** Catches bugs early. Required for production systems.

### Error Boundaries
- React error boundaries catch crashes
- User-friendly error messages
- Fallback UI

**Why added:** Better UX, prevents white screen of death.

### Soft Deletes
- Deleted records not removed from database
- Preserves historical data
- Can restore if needed

**Why added:** Audit compliance, data recovery, analytics not affected.

### SEO Structured Data
- JSON-LD Organization schema
- JSON-LD JobPosting schema

**Why added:** Helps Google understand content. Improves search ranking. SEO is part of modern development.

---

## Feature Status by Category

| Category | MVP | Phase 2 | Phase 3+ | Notes |
|----------|-----|---------|---------|-------|
| **Authentication** | Email/password | + OAuth | + 2FA | OAuth adds complexity, deferred |
| **Companies** | Create, edit | Multiple teams | Admin view | Start simple, expand gradually |
| **Jobs** | CRUD, basic filters | Applications, drafts | AI generation | Focus on browsing first |
| **Content** | 6 section types | Video upload | Template gallery | HTML editor sufficient for MVP |
| **Candidates** | Browse, filter, search | Profiles | Matching ML | Browsing is core value |
| **Analytics** | None | Basic tracking | Advanced reports | Not needed until scale |
| **Notifications** | None | Email alerts | In-app messages | Email adds SendGrid cost |
| **Integrations** | None | Zapier | ATS connectors | Marketplace comes later |
| **Monetization** | Free tier only | Freemium model | Enterprise tiers | Revenue model Phase 4 |

---

## Interview Talking Points

When asked about scope in interviews:

**Q: "Why didn't you build job applications?"**

A: "Job applications would add 3+ hours of development focusing on a secondary feature. The MVP focuses on the core value: helping recruiters build branded pages and candidates discover opportunities. Browsing is the first critical step. Applications, pipeline management, and email notifications are Phase 2. This separation lets me deliver a polished MVP fast, then expand based on user feedback."

**Q: "What would you build next?"**

A: "Phase 2 priorities: (1) Job applications with resume upload, (2) Email notifications, (3) OAuth login. Phase 3: multiple recruiters per company with roles/permissions, approval workflows, admin dashboard. Phase 4: analytics, integrations, custom domains. Each phase builds on previous without breaking changes."

**Q: "How does your system scale?"**

A: "Multi-tenancy via RLS means adding companies doesn't require code changes. Candidates filter on client-side for MVP (<1000 jobs). When jobs scale, I'd move to server-side filtering with database indexes. ATS admin panel (Phase 3) would use separate read replicas. If emails become needed, add background job queue (Supabase functions or separate service)."

**Q: "Why RLS instead of traditional RBAC?"**

A: "RLS is enforced at the database level, so even code bugs can't leak unauthorized data. With traditional RBAC, permission checks are in application code—easy to forget one place and expose data. RLS also scales beautifully: adding new roles is just writing new policies, no code changes needed."

---

## Tracking Template

Use this to update as you build:

```markdown
## Today's Progress

### Completed
- [x] Job filtering UI
- [x] Component tests
- [x] Database indexes

### In Progress
- [ ] Culture video upload
- [ ] Email notifications

### Blockers
- None currently

### Tomorrow
- [ ] Complete video upload
- [ ] Performance optimization
```

---

**Last Updated:** November 16, 2025

