# Complete Project Structure & File Guide

This document explains every file you need for CareerHub, what each does, and which files to commit vs which are for reference only.

---

## Directory Structure

```
careerhub-platform/
│
├── 📋 README.md                          # ✅ COMMIT (Primary entry point for repo)
│   └─ How to run, features, quick nav to specs
│
├── 🔒 .gitignore                         # ✅ COMMIT
│   └─ Prevents committing .env, node_modules, etc.
│
├── 📝 .env.example                       # ✅ COMMIT (Template for env vars)
│   └─ Shows what env vars are needed
│
├── 🔐 .env.local                         # ❌ DO NOT COMMIT
│   └─ Your actual Supabase keys (local development)
│
├── 📦 package.json                       # ✅ COMMIT
│   └─ Dependencies, scripts
│
├── 📦 package-lock.json                  # ✅ COMMIT
│   └─ Lock file for exact dependency versions
│
├── ⚙️ vite.config.ts                     # ✅ COMMIT
│   └─ Vite build configuration
│
├── ⚙️ tsconfig.json                      # ✅ COMMIT
│   └─ TypeScript configuration (strict mode)
│
├── ⚙️ tsconfig.app.json                  # ✅ COMMIT
│   └─ TypeScript app-specific config
│
├── ⚙️ tsconfig.node.json                 # ✅ COMMIT
│   └─ TypeScript node-specific config
│
├── 🎨 tailwind.config.ts                 # ✅ COMMIT
│   └─ Tailwind CSS configuration
│
├── 🧪 vitest.config.ts                   # ✅ COMMIT
│   └─ Test runner configuration
│
├── 📄 index.html                         # ✅ COMMIT
│   └─ Entry HTML file
│
├── specs/                                 # ❌ DO NOT COMMIT
│   │   (For your reference during development)
│   ├── TECHNICAL_SPEC.md                 # 📖 Your technical blueprint
│   ├── database-schema.sql               # 🗄️ Copy-paste to Supabase
│   └── api-endpoints.md                  # (Optional)
│
├── docs/                                  # ❌ DO NOT COMMIT
│   │   (Decision documentation for you)
│   ├── DESIGN_DECISIONS.md               # 📖 Why each tech choice
│   ├── AUTHORIZATION_EXPLAINED.md        # 🔐 Deep dive on RLS
│   ├── REQUIREMENTS_TRACKING.md          # ✅ MVP vs Planned features
│   ├── FAQ.md                            # ❓ Common questions & answers
│   └── SCALING_CONSIDERATIONS.md         # (Optional - future planning)
│
├── src/
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   │
│   │   ├── recruiter/
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── CompanyBranding.tsx
│   │   │   ├── ContentSectionEditor.tsx
│   │   │   ├── DragDropSectionList.tsx
│   │   │   ├── JobManager.tsx
│   │   │   ├── PreviewPane.tsx
│   │   │   └── JobForm.tsx
│   │   │
│   │   ├── candidate/
│   │   │   ├── CareersPageLayout.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── JobListings.tsx
│   │   │   ├── JobFilterBar.tsx
│   │   │   ├── JobCard.tsx
│   │   │   └── JobDetailModal.tsx
│   │   │
│   │   └── auth/
│   │       ├── LoginForm.tsx
│   │       ├── SignupForm.tsx
│   │       └── ProtectedRoute.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCompany.ts
│   │   ├── useJobs.ts
│   │   ├── useContentSections.ts
│   │   └── useVideoUpload.ts
│   │
│   ├── services/
│   │   ├── supabase.ts                   # Supabase client config
│   │   ├── authService.ts
│   │   ├── companyService.ts
│   │   ├── jobService.ts
│   │   ├── contentSectionService.ts
│   │   └── storageService.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── company.ts
│   │   ├── job.ts
│   │   ├── auth.ts
│   │   ├── content.ts
│   │   └── common.ts
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
│   │   ├── CompanyPreview.tsx
│   │   ├── CareersPage.tsx
│   │   ├── NotFound.tsx
│   │   └── Home.tsx
│   │
│   ├── __tests__/
│   │   ├── setup.ts                      # Test configuration
│   │   ├── services/
│   │   │   ├── authService.test.ts
│   │   │   ├── companyService.test.ts
│   │   │   └── jobService.test.ts
│   │   ├── components/
│   │   │   ├── LoginForm.test.tsx
│   │   │   ├── JobCard.test.tsx
│   │   │   └── DragDropSectionList.test.tsx
│   │   └── fixtures/
│   │       └── mockData.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── animations.css
│   │
│   ├── App.tsx                           # Main app component
│   ├── main.tsx                          # React entry point
│   └── vite-env.d.ts                     # Vite type definitions
│
├── public/
│   │
│   ├── sample-data/
│   │   ├── jobs.json                     # ✅ COMMIT (Sample job data from Google Sheets)
│   │   ├── companies.json                # Sample company data
│   │   └── logos/                        # Sample logos for testing
│   │       ├── tech-corp-logo.png
│   │       ├── design-studio-logo.png
│   │       └── startup-logo.png
│   │
│   ├── images/
│   │   └── [other static assets]
│   │
│   └── favicon.ico
│
├── 🎯 AGENT_LOG.md                       # ✅ COMMIT (How you used AI)
│   └─ Prompts, AI help, learnings, overrides
│
└── .github/workflows/ (Optional)          # ❌ Not needed for MVP
    └─ ci.yml                              # CI/CD if you add it later

```

---

## Which Files to Commit to GitHub?

### ✅ COMMIT THESE

**Root level:**
- `README.md` - Primary documentation
- `.gitignore` - Prevent accidental commits
- `.env.example` - Template for env vars
- `package.json` - Dependencies
- `package-lock.json` - Lock file
- `vite.config.ts`, `tsconfig.json`, etc. - Config files
- `index.html` - Entry HTML
- `AGENT_LOG.md` - How you used AI

**Source code:**
- `src/**` - All React components, services, hooks, types
- `public/**` - Static assets and sample data

**Tests:**
- `__tests__/**` - Test files

### ❌ DO NOT COMMIT THESE

- `.env.local` - Your actual Supabase keys
- `.env` - Any environment-specific files
- `node_modules/` - Dependencies (npm install recreates)
- `dist/` - Build output (builds regenerate)
- `coverage/` - Test coverage reports
- `.DS_Store` - OS files
- `specs/` folder - Reference docs (keep locally)
- `docs/` folder - Decision docs (keep locally)

---

## File-by-File Breakdown

### Documentation Files (COMMIT)

**README.md** (7 KB)
- Entry point for repo
- Quick nav to other docs
- How to run locally
- Tech stack summary
- Future roadmap

**AGENT_LOG.md** (2-3 KB - You write this)
- How you used AI for brainstorming
- Prompts you gave
- Where AI helped
- Where you overruled AI
- Key learnings

**Specs Folder** (Reference - Keep Locally)
- `TECHNICAL_SPEC.md` (20+ KB)
  - Complete technical blueprint
  - Database schema explained
  - Features table
  - Testing strategy
  - Not committed to git

- `database-schema.sql` (15+ KB)
  - Complete SQL schema
  - Copy-paste directly to Supabase
  - RLS policies included
  - Comments and docs

**Docs Folder** (Reference - Keep Locally)
- `DESIGN_DECISIONS.md` (18+ KB)
  - Why each tech choice
  - Trade-offs explained
  - Interview talking points
  - Not committed to git

- `AUTHORIZATION_EXPLAINED.md` (12+ KB)
  - Deep dive on RLS vs RBAC
  - How to scale personas
  - Debugging RLS issues
  - Not committed to git

- `REQUIREMENTS_TRACKING.md` (8+ KB)
  - What was asked vs what we built
  - Feature status by phase
  - Not committed to git

- `FAQ.md` (15+ KB)
  - Common questions answered
  - Technical deep dives
  - Interview prep
  - Not committed to git

### Configuration Files (COMMIT)

- `vite.config.ts` - Vite build config
- `tsconfig.json` - TypeScript strict mode
- `tailwind.config.ts` - Tailwind CSS tokens
- `vitest.config.ts` - Test runner config
- `package.json` - Dependencies and scripts
- `package-lock.json` - Lock file

### Environment Files

- `.env.example` (COMMIT)
  ```
  VITE_SUPABASE_URL=
  VITE_SUPABASE_ANON_KEY=
  ```

- `.env.local` (DO NOT COMMIT)
  ```
  VITE_SUPABASE_URL=https://xxx.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGc...
  ```

### Sample Data (COMMIT)

- `public/sample-data/jobs.json` - Sample jobs from Google Sheets
- `public/sample-data/companies.json` - Sample companies
- `public/sample-data/logos/` - Sample logo images for testing

---

## How to Use These Files

### Before Starting Development

1. Read `README.md` (understand the big picture)
2. Keep `specs/TECHNICAL_SPEC.md` open (reference while coding)
3. Review `docs/DESIGN_DECISIONS.md` (understand why choices were made)
4. Check `docs/FAQ.md` (answers to questions that come up)

### During Development

1. Reference `specs/TECHNICAL_SPEC.md` for schema, types, features
2. Reference `specs/database-schema.sql` for SQL copy-paste
3. Reference `docs/AUTHORIZATION_EXPLAINED.md` when implementing RLS
4. Use `docs/REQUIREMENTS_TRACKING.md` to track what's done

### Before Submission

1. Write `AGENT_LOG.md` with your AI usage details
2. Make sure `README.md` is complete with setup instructions
3. Ensure `TECHNICAL_SPEC.md` is accurate (no AI, your words)
4. Commit all `src/`, test files, configs, sample data

### After Submission (For Learning)

1. Use `docs/` files to explain your choices in interviews
2. Reference `docs/DESIGN_DECISIONS.md` for technical questions
3. Use `docs/FAQ.md` to answer follow-up questions
4. Explain your RLS setup using `docs/AUTHORIZATION_EXPLAINED.md`

---

## File Sizes & Ratios

```
Committed to Git:
├── src/ - 80-100 KB (source code)
├── __tests__/ - 20-30 KB (tests)
├── public/sample-data/ - 5-10 KB (sample data)
├── Config files - 5-10 KB
├── README.md - 7 KB
└── AGENT_LOG.md - 3 KB
────────────────────────
Total: ~120-160 KB (very small repo!)

NOT Committed (Local Reference):
├── specs/ - 50-70 KB (reference docs)
├── docs/ - 60-80 KB (decision docs)
├── node_modules/ - 200+ MB (auto-installed)
├── dist/ - 50-150 KB (auto-built)
├── .env.local - 0.1 KB (your keys)
────────────────────────
Total: ~250+ MB (not in git)
```

---

## GitHub Action Files (Optional)

If you want to add automated tests on every push:

**`.github/workflows/ci.yml`** (COMMIT IF ADDED)
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test
      - run: npm run build
```

**For MVP:** Not necessary. Manual testing is fine.

---

## Summary: What to Give Your Reviewer

**Upload to GitHub:**
```
✅ All source code (src/)
✅ All tests (__tests__/)
✅ Config files (vite.config.ts, etc.)
✅ README.md (with setup instructions)
✅ AGENT_LOG.md (how you used AI)
✅ Sample data (public/sample-data/)
✅ .env.example (template)
✅ .gitignore
```

**Keep Locally (Not in Git):**
```
❌ specs/ (reference docs)
❌ docs/ (decision docs)
❌ .env.local (your actual keys)
❌ node_modules/
❌ dist/
```

**Provide Separately:**
```
✅ GitHub repo link (all committed files)
✅ Live Vercel link (deployed app)
✅ Demo video link (YouTube or Drive)
✅ Spreadsheet link (to specs files if needed)
```

---

## Key Takeaway

| Category | Commit? | Purpose |
|----------|---------|---------|
| **Source Code** | ✅ | Running app |
| **Tests** | ✅ | Prove quality |
| **Config** | ✅ | Build & deploy |
| **Docs (README)** | ✅ | How to use |
| **Docs (Specs)** | ❌ | Your reference |
| **Docs (Decisions)** | ❌ | Your learning |
| **Keys (.env)** | ❌ | Security |
| **Dependencies** | ❌ | Auto-installed |
| **Builds** | ❌ | Auto-generated |

---

**Last Updated:** November 16, 2025

