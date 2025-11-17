# CareerHub: Multi-Company Careers Page Builder

**Live Link:** [Will be added after deployment]

## Quick Navigation

- **Technical Specification:** See `specs/TECHNICAL_SPEC.md`
- **Database Schema:** See `specs/database-schema.sql`
- **Decisions & Trade-offs:** See `docs/DESIGN_DECISIONS.md`
- **Authorization Deep Dive:** See `docs/AUTHORIZATION_EXPLAINED.md`
- **Feature Tracking:** See `docs/REQUIREMENTS_TRACKING.md`
- **How to Run Locally:** See section below

---

## What This Project Does

A SaaS platform that enables companies to build branded, customizable careers pages where candidates can discover and explore job opportunities.

### For Recruiters
- Sign up and create a company profile
- Customize page branding: upload logo, banner, set colors, select fonts
- Manage content sections: About Us, Mission, Life at Company, Perks, Team, FAQs
- Reorder sections via drag-and-drop
- Create and manage job postings
- Live preview while editing
- Publish careers page to a public URL
- Track page analytics (planned)

### For Candidates
- Visit public careers pages by company URL
- Discover company branding and story
- Browse open job listings
- Filter by location, job type, experience level
- Search by job title
- View detailed job information
- Mobile-responsive experience

### For ATS Platform (Admin)
- Manage system configuration
- Monitor company activity
- Approve/review published pages (planned)
- Access analytics (planned)

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | React 19 + TypeScript | Type safety, modern component patterns |
| **Build Tool** | Vite | Fast builds, instant HMR |
| **Styling** | Tailwind CSS | Rapid UI development, responsive design |
| **Database** | Supabase PostgreSQL | Managed, multi-tenancy via RLS, free tier substantial |
| **Auth** | Supabase Auth | Built-in, secure, email-based (OAuth planned) |
| **Storage** | Supabase Storage | CDN-backed, image/video storage |
| **Testing** | Vitest + React Testing Library | Fast, modern, Vite-native |
| **Deployment** | Vercel + Supabase | Auto-deploys, global CDN, free tier |

**Cost:** $0/month (all free tiers) — upgrade only when scaling significantly

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- GitHub account
- Supabase account (free tier)

### Local Development

1. **Clone repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/careerhub-platform.git
   cd careerhub-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   Create `.env.local` in project root:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
   
   Get these from your Supabase project:
   - Go to Supabase Dashboard → Settings → API
   - Copy "Project URL" → `VITE_SUPABASE_URL`
   - Copy "anon public" key → `VITE_SUPABASE_ANON_KEY`

4. **Setup database**
   - Go to Supabase Dashboard → SQL Editor
   - Create new query
   - Copy entire contents from `specs/database-schema.sql`
   - Execute query
   - Verify all tables created

5. **Seed sample data** (optional)
   - Run seed script: `npm run seed` (when available)
   - Or manually import from `public/sample-data/jobs.json`

6. **Run development server**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173

7. **Run tests**
   ```bash
   npm run test
   npm run test:coverage
   ```

---

## Project Structure

```
careerhub-platform/
├── specs/                          # Technical documentation
│   ├── TECHNICAL_SPEC.md          # Complete tech spec
│   ├── database-schema.sql        # Full database schema
│   └── api-endpoints.md           # API reference
│
├── docs/                           # Decision documentation (not committed)
│   ├── DESIGN_DECISIONS.md        # Why we chose each tech/approach
│   ├── AUTHORIZATION_EXPLAINED.md # Deep dive on RLS & security
│   ├── REQUIREMENTS_TRACKING.md   # Feature tracking (MVP vs Planned)
│   ├── FAQ.md                     # Common questions & answers
│   └── SCALING_CONSIDERATIONS.md  # How to scale beyond MVP
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navbar.tsx
│   │   ├── recruiter/
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── CompanyBranding.tsx
│   │   │   ├── ContentSectionEditor.tsx
│   │   │   ├── DragDropSectionList.tsx
│   │   │   └── JobManager.tsx
│   │   ├── candidate/
│   │   │   ├── CareersPageLayout.tsx
│   │   │   ├── JobListings.tsx
│   │   │   ├── JobFilterBar.tsx
│   │   │   └── JobCard.tsx
│   │   └── auth/
│   │       ├── LoginForm.tsx
│   │       ├── SignupForm.tsx
│   │       └── ProtectedRoute.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCompany.ts
│   │   ├── useJobs.ts
│   │   └── useContentSections.ts
│   │
│   ├── services/
│   │   ├── supabase.ts            # Supabase client config
│   │   ├── authService.ts
│   │   ├── companyService.ts
│   │   ├── jobService.ts
│   │   └── storageService.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── company.ts
│   │   ├── job.ts
│   │   └── auth.ts
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── CompanyContext.tsx
│   │
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Dashboard.tsx
│   │   ├── CompanyEdit.tsx
│   │   ├── CareersPage.tsx
│   │   └── NotFound.tsx
│   │
│   ├── __tests__/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── fixtures/
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── variables.css
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── public/
│   ├── sample-data/
│   │   ├── jobs.json
│   │   └── sample-logos/           # Sample logos for testing
│   └── images/
│
├── .env.local (not committed)      # Local environment variables
├── .env.example                    # Template for env vars
├── .gitignore
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── vitest.config.ts
└── README.md (this file)
```

**Files to NOT commit:**
- `.env.local` (local environment variables)
- `node_modules/`
- `dist/`
- `specs/` folder (for your reference only during development)
- `docs/` folder (for your reference only during development)

---

## Key Features

### MVP (Core - Buildable in 6-8 hours)

**Recruiter Features**
- Email/password authentication (OAuth as planned feature)
- Create and customize company profile
- Upload logo and banner images
- Set brand colors (primary, secondary, accent)
- Select font family
- Add company mission/story
- Manage content sections (6 predefined types)
- Drag-and-drop section reordering
- Create, edit, delete job postings
- Live preview of careers page
- Publish/unpublish page visibility
- Copy shareable link
- Soft delete for jobs (audit trail)

**Candidate Features**
- Browse public careers pages by company slug
- View company branding and story
- List open jobs with key details
- Filter jobs: location, job type, experience level
- Search jobs by title
- View full job details in modal
- Mobile-responsive UI
- Keyboard navigation support
- Screen reader accessible

**Technical**
- TypeScript strict mode throughout
- Row Level Security (RLS) for multi-tenancy
- Real-time data with Supabase subscriptions
- Error boundaries and error handling
- Loading states and skeletons
- Unit tests on core services
- Component tests on critical UI
- SEO meta tags on public pages
- Structured data (JSON-LD)

### Planned Features (Phase 2+)

- Job applications with candidate pipeline
- Email notifications (Resend integration)
- OAuth authentication (Google, LinkedIn)
- Job application tracking
- Candidate profiles and matching
- Interview scheduling
- Admin dashboard and approval workflows
- Page analytics and insights
- Email template customization
- Custom domain support
- API for third-party integrations
- Advanced filtering and search
- Job status as "draft" before publishing

---

## How It Works: Key Flows

### Recruiter Signup & Setup
1. Recruiter signs up with email/password
2. System creates recruiter account
3. Recruiter creates company profile
4. Uploads logo and banner
5. Sets brand colors and fonts
6. System ready for adding content

### Adding Jobs & Publishing
1. Recruiter creates job posting (title, description, location, type, salary, level)
2. Jobs saved as "draft" initially
3. Recruiter can preview careers page with jobs
4. When ready, recruiter publishes page (is_published = true)
5. Page becomes live at `/:company-slug/careers`

### Candidate Browsing
1. Candidate finds URL (social media, email, job boards)
2. Visits public careers page
3. Sees company branding, story, content sections
4. Browses all open jobs
5. Filters and searches for relevant positions
6. Clicks job to see full details

### Data Isolation
- Each company's data stored separately
- Recruiter can only see/edit their own company via RLS policies
- Candidates can only see published companies
- Admin (ATS platform) has access to all via backend (future)

---

## Important Design Decisions

For detailed explanation of why each decision was made, see `docs/DESIGN_DECISIONS.md`. Key decisions include:

- **Why Supabase instead of backend**: RLS handles authorization, no backend logic layer needed
- **Why no job applications in MVP**: Focus on browsing experience first, applications come in Phase 2
- **Why RLS for authorization**: Secure, database-level enforcement, scales well
- **Why email-based auth initially**: Simpler MVP, OAuth added as planned feature
- **Why Vercel for deployment**: Auto-deploys on git push, no CI/CD config needed, free tier excellent

---

## Authorization & Security

The app uses **Row Level Security (RLS)** policies at the database level for authorization. This is different from traditional role-based access control (RBAC) with permission tables.

**How it works:**
- Each query automatically filters based on `auth.uid()` (current user's ID)
- Recruiter can only see/modify their own company
- Candidates can only see published companies
- No backend logic needed - PostgreSQL enforces it

See `docs/AUTHORIZATION_EXPLAINED.md` for deep dive on:
- How RLS policies work
- How to add new roles/personas in future
- Why this approach scales well
- Comparison with traditional RBAC

---

## Requirements Tracking

To see what was built for MVP vs what's planned for future, see `docs/REQUIREMENTS_TRACKING.md`. This tracks:

- **Assignment Requirements** - What was asked for
- **Essential Features** - What we built to meet requirements
- **Basic Features** - Nice-to-have functionality included
- **Planned/Advanced Features** - What we're deferring to Phase 2+

This helps you understand scope and see what's possible for future enhancement.

---

## Testing

Run tests with:
```bash
npm run test              # Run all tests
npm run test:ui          # Interactive test UI
npm run test:coverage    # Coverage report
```

Tests focus on:
- **Services:** Authentication, data fetching, business logic
- **Components:** Critical UI paths, form submission, filtering
- **Integration:** End-to-end user flows

Target coverage: 70%+ on services, 50%+ on components

---

## Deployment

### Deploy to Vercel

1. **Commit and push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to vercel.com
   - Sign in with GitHub
   - Click "New Project"
   - Select `careerhub-platform` repo
   - Vercel auto-detects Vite configuration

3. **Add Environment Variables**
   - In Vercel project settings → Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - These are public keys, safe to expose

4. **Deploy**
   - Click Deploy
   - Wait ~2 minutes
   - App is live at vercel.com-generated URL

5. **Auto-Deployments**
   - Every `git push` to main triggers auto-deploy
   - No additional setup needed
   - Vercel handles CI/CD automatically

### Why Vercel & No Manual CI/CD?

Vercel's free tier includes:
- Auto-deployment on git push
- Global CDN caching
- Automatic SSL certificates
- Preview deployments for branches
- No GitHub Actions configuration needed

This is included free - no need to setup GitHub Actions for this MVP.

---

## FAQ & Common Questions

See `docs/FAQ.md` for answers to:
- "What if we need job applications later?"
- "How does authorization actually work with RLS?"
- "Why PostgreSQL over NoSQL?"
- "Can we handle millions of users?"
- "What about OAuth login?"
- And many more...

---

## Future Roadmap

### Phase 2: Recruiter Tools
- Job application tracking
- Candidate profiles
- Email notifications
- Interview scheduling

### Phase 3: Team & Admin
- Multiple recruiters per company
- Approval workflows
- Admin dashboard
- Activity audit logs

### Phase 4: Marketplace
- Premium templates
- Custom domain support
- API access
- Advanced analytics

See `docs/SCALING_CONSIDERATIONS.md` for how to approach these without major rewrites.

---

## Build with AI - Decisions Made

This project was built with AI assistance at various stages:
- Architecture brainstorming and design validation
- Component scaffolding and code generation
- Testing setup and test case generation
- Documentation and specification writing

**How I used AI:**
- Prompt 1: "Design a multi-tenant careers page builder" → Got architecture overview
- Prompt 2: "Generate RLS policies for multi-company data isolation" → Got SQL patterns
- Prompt 3: "Create React component for drag-drop sections" → Got base component
- [See AGENT_LOG.md for complete AI usage details]

**Where I overruled AI:**
- Changed authorization from custom middleware to RLS (better approach)
- Removed unnecessary backend services (Supabase handles it)
- Simplified data model (removed over-engineering)

---

## Questions & Support

For project questions:
- Check `docs/FAQ.md` first
- Review `docs/DESIGN_DECISIONS.md` for "why" behind decisions
- See `docs/AUTHORIZATION_EXPLAINED.md` for security questions
- Check `docs/REQUIREMENTS_TRACKING.md` for scope questions

For technical issues:
- Check TypeScript compiler errors
- Review console logs
- Check Supabase dashboard for RLS policy issues

---

## License

This project is for educational purposes as part of a recruitment assignment.

---

**Version:** 1.0  
**Last Updated:** November 16, 2025  
**Status:** MVP Ready for Development

