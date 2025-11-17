# Design Decisions & Trade-offs: CareerHub Platform

This document explains the "why" behind major architecture and technology decisions. Use this to understand trade-offs and justify choices in interviews.

---

## 1. Authentication: Email/Password (MVP) + OAuth (Planned)

### Decision
- **MVP:** Email/password only via Supabase Auth
- **Planned (Phase 2):** Add OAuth (Google, LinkedIn)

### Why Email/Password First?

**Pros:**
- Simpler to implement (1-2 hours)
- No external OAuth provider setup
- Works offline (when testing)
- User owns their credentials

**Cons:**
- Slightly more friction for users
- Password management burden on users

**Why Not OAuth in MVP:**
- Adds setup complexity (OAuth provider config, redirect URIs)
- Each provider has different requirements (Google vs LinkedIn vs GitHub)
- Takes extra time without much user value for MVP
- Can add in Phase 2 without breaking existing auth

### How We'll Add OAuth Later

Supabase Auth supports multiple providers simultaneously:
```typescript
// Future: Both email and Google available
await supabase.auth.signInWithOAuth({
  provider: 'google'
});
```

No database changes needed—Supabase handles it.

---

## 2. Authorization: RLS vs Traditional RBAC

### Decision
- **Use:** PostgreSQL Row Level Security (RLS)
- **Don't use:** Traditional RBAC with permission tables

### Why RLS Instead of RBAC?

#### Traditional RBAC Pattern
```sql
-- Roles table
users_roles: id, user_id, role_id

-- Permissions table
role_permissions: role_id, permission_id

-- Application checks:
if (user.role === 'recruiter') {
  allow access to company
}
```

**Problems:**
- Authorization logic in application (can be bypassed)
- Need permission lookup for every request
- Hard to test (depends on app logic)
- Easier to accidentally expose data

#### RLS Pattern
```sql
CREATE POLICY recruiter_access ON companies
FOR ALL
USING (recruiter_id = auth.uid());
```

**Advantages:**
- Enforced at database level (can't bypass)
- PostgreSQL checks every query automatically
- Simple to test (query always scoped correctly)
- Impossible to leak unauthorized data
- Works with any frontend framework

### Scaling: Adding More Roles Later

Current setup (2 personas: Recruiter, Candidate) works perfectly.

When you need more roles (e.g., Hiring Manager, Recruiter, Reviewer, Admin):

**Option 1: Add role to auth.users**
```sql
ALTER TABLE auth.users 
ADD COLUMN role VARCHAR(50) DEFAULT 'candidate';

CREATE POLICY role_based_access ON companies
FOR ALL
USING (
  (auth.jwt()->'user_metadata'->>'role' = 'admin') OR
  (recruiter_id = auth.uid())
);
```

**Option 2: Create multi-role junction table**
```sql
CREATE TABLE company_members (
  user_id UUID REFERENCES auth.users(id),
  company_id UUID REFERENCES companies(id),
  role VARCHAR(50),  -- 'recruiter', 'hiring_manager', 'reviewer'
  UNIQUE(user_id, company_id)
);

-- RLS policy checks this table
CREATE POLICY team_access ON companies
FOR ALL
USING (
  (recruiter_id = auth.uid()) OR
  (id IN (
    SELECT company_id FROM company_members 
    WHERE user_id = auth.uid()
  ))
);
```

**Both approaches scale without major rewrites.** Choose Option 1 if roles are global, Option 2 if roles are per-company.

---

## 3. Backend vs No Backend: Why Supabase Only?

### Decision
- **No backend needed for MVP**
- RLS + Supabase Auth handles everything

### Why Not a Backend (Flask/Node)?

**Hypothetical Backend Setup:**
```
React Frontend 
  → Flask API Server (auth, validation, authorization)
    → PostgreSQL Database
```

**What Backend Would Do:**
- Handle login/signup (but Supabase does this)
- Validate input (but PostgreSQL constraints do this)
- Check permissions (but RLS does this)
- Return JSON responses (but Supabase REST API does this)

**All of these are already in Supabase.**

### Cost Comparison

| Approach | Frontend | Backend | Database | Total |
|----------|----------|---------|----------|-------|
| **Supabase Only** | Vercel Free | — | Supabase Free | **$0** |
| **Backend-based** | Vercel Free | Railway $5/mo | PostgreSQL | ~**$5-10/mo** |
| **AWS Free Tier** | EC2 | EC2 | RDS | ~**$0 (1 year, then $$)** |

### When You'd Need Backend Later

Add backend for:
- **Email notifications:** SendGrid/Resend integration
- **File virus scanning:** ClamAV or VirusTotal API
- **Complex ML models:** Custom predictions
- **Webhook handling:** 3rd-party integrations
- **Rate limiting:** Prevent abuse at application level
- **Caching layer:** Redis for frequent queries

**Note:** Supabase actually provides email via Resend (free for 3k emails/month), and webhooks are coming to their roadmap. So even fewer reasons to build backend.

### The Real Advantage: No Ops

Running a backend means:
- Monitoring uptime (24/7?)
- Scaling when traffic spikes
- Database backups and recovery
- Security patches
- Deployment pipelines

Vercel + Supabase = **fully managed, you focus on features.**

---

## 4. No Job Applications (MVP): Why?

### Decision
- MVP: Browsing only (view jobs, filter)
- Phase 2: Job applications & pipeline

### Why Not Include Applications?

**Scope & Time:**
- Job browsing: 2-3 hours
- Job applications: additional 3-4 hours
- Application tracking: another 2-3 hours

**Interview Context:**
The assignment prioritizes **core value demonstration:**
- Show you can build multi-tenant systems
- Demonstrate data modeling
- Show recruiter + candidate flows

Job applications add volume but not complexity.

### How It Works in Interview

**Q: "Why no applications?"**

A: "Applications introduce complexity beyond MVP scope. Browsing experience shows the core value—companies can share their story, candidates discover opportunities. Applications add the next layer: collecting data, managing pipeline, email notifications. That's Phase 2. This MVP focuses on the discovery experience."

**Q: "Wouldn't users want to apply?"**

A: "Absolutely. For Phase 2, we'd add an application form with fields (name, email, resume, cover letter), store in database, send notifications, and give recruiters a dashboard. But for MVP, linking to external careers boards (or leaving as Phase 2 work) keeps scope focused."

### Migration Path to Applications

When adding Phase 2:
```sql
CREATE TABLE applications (
  id UUID,
  job_id UUID REFERENCES jobs(id),
  candidate_email VARCHAR(255),
  candidate_name VARCHAR(255),
  resume_url VARCHAR(500),  -- Stored in Supabase Storage
  cover_letter TEXT,
  status VARCHAR(50),  -- 'new', 'reviewed', 'rejected', 'accepted'
  created_at TIMESTAMP
);
```

No backend needed—same Supabase patterns.

---

## 5. Vercel + Supabase vs AWS vs Other Options

### Decision
- **Frontend:** Vercel Free
- **Database:** Supabase Free
- **Don't use:** AWS, Render (overkill for MVP)

### Comparison

| Aspect | Vercel | AWS (Free Tier) | Render | Railway |
|--------|--------|-----------------|--------|---------|
| **Deployment** | Auto on git push | Manual (EC2) | Auto | Auto |
| **Learning Curve** | 5 min | 2-3 hours | 30 min | 30 min |
| **SSL/HTTPS** | Free, auto | Free | Free, auto | Free, auto |
| **Cost After Free** | Pay-per-use | $10+ monthly | $7+ monthly | $5+ monthly |
| **Scaling** | Auto, unlimited | Manual setup | Auto | Auto |
| **CI/CD Needed** | No | Yes (complex) | No | No |
| **Good for MVP** | ✅ Best | ❌ Overkill | ✅ Good | ✅ Good |

### Why Not AWS Free Tier?

AWS free tier includes:
- 750 hours/month EC2 (1 small instance)
- RDS PostgreSQL 750 hours/month
- 5GB S3 storage

**Sounds great, but...**

1. **Setup Hell:** 2-3 hours to configure VPC, security groups, IAM, RDS
2. **Expiry Date:** 12 months, then you pay
3. **Overspend Risk:** Data transfer charges, accidental resources
4. **No Auto-Deploy:** Need to setup CI/CD (GitHub Actions, CodePipeline)
5. **Not Managed:** You patch databases, manage backups, scale manually

**For MVP:** Vercel + Supabase = 10x simpler, same end result.

---

## 6. Drag-Drop Sections: React Beautiful DND vs Alternatives

### Decision
- **Use:** React Beautiful DND
- **Why not:** HTML5 drag-drop (browser API), Dnd Kit, SortableJS

### Comparison

| Library | Ease | Mobile | Performance | Bundle Size |
|---------|------|--------|-------------|------------|
| **React Beautiful DND** | Easy | Good | Excellent | 50KB |
| **HTML5 Drag API** | Hard | Bad | Good | 0KB (native) |
| **Dnd Kit** | Hard | Excellent | Excellent | 30KB |
| **SortableJS** | Medium | Good | Good | 70KB |

### Why React Beautiful DND?

- **Mature ecosystem:** Used by Trello, Jira, many large apps
- **Great DX:** Smooth animations, good docs
- **Mobile support:** Works on touch devices
- **Community:** Lots of examples, Stack Overflow answers

**Trade-off:** React Beautiful DND is moving to maintenance mode (no new features), but it's rock-solid for sorting.

---

## 7. Tailwind CSS vs Other Styling Solutions

### Decision
- **Use:** Tailwind CSS
- **Why not:** Material-UI, Chakra, Emotion/Styled Components

### Comparison

| Solution | Speed | Mobile | Design System | Bundle | Good for MVP |
|----------|-------|--------|---------------|--------|------------|
| **Tailwind** | ⚡⚡⚡ | ✅ Mobile-first | ✅ Design tokens | 30KB | ✅ Best |
| **Chakra UI** | ⚡⚡ | ✅ Good | ✅ Pre-built | 150KB | ✅ Good |
| **Material-UI** | ⚡ | ✅ Good | ✅ Opinionated | 300KB+ | ⚠️ Overkill |
| **CSS-in-JS** | ⚡⚡ | ✅ Good | ❌ Manual | 100KB+ | ⚠️ Complex |

### Why Tailwind for MVP?

1. **Fastest to style:** Write CSS inline with classes
2. **Mobile-first:** Responsive breakpoints built-in
3. **Design consistency:** Pre-defined spacing, colors, typography
4. **Zero runtime:** All CSS compiled at build time
5. **Easy to extend:** Tailwind config for brand colors

Example:
```tsx
// 3 lines to create a responsive button
<button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded md:px-6 md:py-3">
  Click me
</button>
```

Same in Chakra would be 10+ lines of component setup.

---

## 8. Vite vs Webpack vs Next.js vs Parcel

### Decision
- **Use:** Vite + React
- **Why not:** Create React App, Next.js, Webpack

### Why Vite?

**The Problem It Solves:**

Webpack (CRA default):
```
Changes code → Webpack rebundles everything → 5-10 second refresh
```

Vite:
```
Changes code → Hot reload specific module → <100ms refresh
```

### Comparison

| Tool | Build Speed | Dev Speed | Learning | Complexity |
|------|-------------|-----------|----------|-----------|
| **Vite** | ⚡⚡⚡ 0.5s | ⚡⚡⚡ Sub-100ms HMR | Easy | Low |
| **CRA** | ⚡ 30s | ⚡⚡ 2-3s HMR | Easy | Medium |
| **Next.js** | ⚡⚡ 3-5s | ⚡⚡ 1-2s HMR | Medium | High |
| **Webpack** | ⚡ 20s+ | ⚡ 5-10s HMR | Hard | Very High |

### Why Not Next.js?

Next.js is amazing for:
- Server-side rendering (SSR)
- API routes
- SEO-critical pages

But we don't need these for MVP:
- Supabase API handles backend
- Static site generation (Vercel does this)
- SEO via meta tags (React Helmet)

**Vite gives us:** Fast builds, hot reload, modern tooling without overhead.

---

## 9. Data Storage: Supabase PostgreSQL vs Firebase vs MongoDB

### Decision
- **Use:** Supabase PostgreSQL
- **Why not:** Firebase Firestore, MongoDB, Neon.tech

### Why PostgreSQL (Supabase)?

| Feature | PostgreSQL | Firebase | MongoDB |
|---------|-----------|----------|---------|
| **Multi-Tenancy** | ✅ RLS (best) | ⚠️ Firestore rules | ✅ Query filtering |
| **Relationships** | ✅ Foreign keys | ❌ Denormalization | ❌ Denormalization |
| **Transactions** | ✅ ACID | ❌ Eventual consistency | ⚠️ Limited |
| **Audit Trail** | ✅ Easy (audit tables) | ⚠️ Requires custom logic | ⚠️ Requires custom logic |
| **Free Tier** | 500MB (Supabase) | 1GB (Firebase) | — |
| **Full-Text Search** | ✅ Built-in | ❌ Requires external | ✅ Built-in |

### Why Not Firebase?

Firebase is great but:
- Forces NoSQL patterns (harder for structured data)
- No foreign key relationships (manual denormalization)
- Firestore pricing gets expensive fast
- Rules system is complex for complex permissions

### Why Supabase?

- **PostgreSQL power:** Relationships, transactions, ACID compliance
- **RLS:** Perfect for multi-tenancy
- **Realistic data modeling:** Learn SQL patterns used in real companies
- **Free tier is generous:** 500MB is huge for MVP

---

## 10. Testing: Vitest vs Jest

### Decision
- **Use:** Vitest + React Testing Library
- **Why not:** Jest

### Why Vitest?

| Aspect | Vitest | Jest |
|--------|--------|------|
| **Speed** | ⚡⚡⚡ (faster by 10x) | ⚡⚡ |
| **ESM Support** | Native | Via workarounds |
| **TypeScript** | Native | Via ts-jest |
| **Vite Config** | Reuses vite.config.ts | Separate setup |
| **Learning Curve** | Same as Jest | Same |

Since we're using Vite, Vitest integrates perfectly (reuses vite.config.ts, faster tests).

---

## 11. Code Organization: Feature-Based vs Layer-Based

### Decision
- **Use:** Hybrid approach
  - Utilities by layer (services, hooks, types)
  - Components by feature (recruiter, candidate)

### Example
```
src/
├── services/          # By layer (data fetching)
│   ├── authService
│   ├── companyService
│   └── jobService
├── components/        # By feature (UI)
│   ├── recruiter/
│   ├── candidate/
│   └── common/
├── hooks/            # By layer (custom hooks)
└── pages/            # By layer (routes)
```

### Why This Hybrid?

**Layer-based is good for:** Utilities, services, shared logic
**Feature-based is good for:** Components, pages

The hybrid gives you:
- Easy to find utilities (all services together)
- Easy to find component features (all recruiter stuff in one folder)

---

## 12. Environment Configuration

### Decision
- `.env.local` for local development (not committed)
- `.env.example` as template (committed)
- `.env` is never committed to git

### Why Not Commit .env?

```
# .env (DO NOT COMMIT)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...  # Public but scoped
```

If committed to GitHub:
- Anyone can clone and access your database
- Accidentally pushed to production
- Risk of data breach

### Public vs Secret Keys

Supabase provides two keys:
- **Anon Key** (safe to expose): Limited permissions, only SELECT from public data
- **Service Role Key** (SECRET): Full access, never in frontend

We use only Anon Key in React (it's in the code), and Service Role Key only in backend (if we build one later).

---

## 13. Data Seeding Strategy

### Decision
- **Seed sample data** for testing
- **Location:** `public/sample-data/jobs.json`
- **How:** Import on app load or via admin seeding script

### Why Seed Data?

1. **Faster testing:** Don't manually create test data
2. **Reproducible:** Everyone tests with same data
3. **Demo ready:** Show working app immediately
4. **Candidate flows:** Test full experiences (browsing, filtering)

### Sample Data Structure

```json
{
  "companies": [
    {
      "name": "Tech Corp India",
      "slug": "tech-corp-india",
      "primary_color": "#0066CC",
      "mission_statement": "..."
    }
  ],
  "jobs": [
    {
      "company_slug": "tech-corp-india",
      "title": "Senior React Developer",
      "location": "Bangalore",
      "job_type": "full-time",
      "experience_level": "senior",
      "description": "..."
    }
  ]
}
```

---

## 14. SEO Strategy: Static vs Dynamic

### Decision
- **Meta tags:** Helmet (runtime)
- **Structured data:** JSON-LD (runtime)
- **Sitemap:** Generated at build time (planned)

### Why Not Next.js SSR?

Next.js SSR provides:
- Pre-rendered HTML (better for initial load)
- SEO-friendly (crawlers see full page)

But:
- Adds complexity
- Vite + React + meta tags sufficient for MVP
- Can migrate to Next.js later if needed

### Current Approach

```tsx
import { Helmet } from 'react-helmet-async';

<Helmet>
  <title>{company.name} - Careers</title>
  <meta name="description" content={company.mission_statement} />
  <meta property="og:title" content={company.name} />
</Helmet>
```

This works because:
- React renders on client, Helmet updates DOM
- Google's crawler is JS-capable (can see dynamic content)
- Meta tags are updated before page fully loads

### Future: Server-Side Rendering

If search ranking becomes critical, migrate to Next.js:
```tsx
export async function getStaticProps(context) {
  const company = await getCompany(context.params.slug);
  return { props: { company } };
}
```

No code changes needed—same React components work.

---

## 15. Soft Deletes vs Hard Deletes

### Decision
- **Use:** Soft deletes (set `deleted_at` timestamp)
- **Why:** Preserve audit trail, can recover data

### Example

```sql
-- Soft delete: mark as deleted
UPDATE jobs SET deleted_at = NOW() WHERE id = 'job-123';

-- Hard delete: permanently remove (never do this)
DELETE FROM jobs WHERE id = 'job-123';
```

### Queries Always Filter Soft Deletes

```sql
SELECT * FROM jobs 
WHERE company_id = 'company-123'
AND deleted_at IS NULL;  -- Only show active jobs
```

### Benefits

- Audit trail preserved (can see who deleted what)
- Data recovery (restore via UPDATE)
- Analytics not affected (can count deleted jobs)
- Compliance (some industries require audit logs)

### Trade-off

Tables grow slightly (deleted rows take space), but benefit outweighs cost.

---

## Summary Table: All Decisions at a Glance

| Decision | Choice | Reason | Revisit When |
|----------|--------|--------|--------------|
| Auth | Email + OAuth (P2) | Simple MVP, OAuth adds complexity | Scale users |
| Authorization | RLS | Database-level enforcement, scales well | Always |
| Backend | None (Supabase only) | RLS + REST API sufficient | Need email/webhooks |
| Applications | Phase 2 | Scope focus on browsing | After MVP |
| Deployment | Vercel + Supabase | Auto-deploy, free tier, managed | Hits free tier limits |
| Drag-Drop | React Beautiful DND | Mature, good DX, mobile support | Always |
| Styling | Tailwind | Fast, mobile-first, easy | Always |
| Build | Vite | Fast builds, native ESM, dev HMR | Scale to 100+ components |
| Database | PostgreSQL (Supabase) | RLS, relationships, free tier | Always |
| Testing | Vitest | Vite-native, fast, same as Jest | Always |
| Org | Hybrid (layer + feature) | Best of both worlds | Always |
| SEO | Meta tags + JSON-LD | Sufficient for MVP, SSR later | Ranking important |
| Deletes | Soft deletes | Audit trail, recovery, compliance | Always |

---

**These decisions were made to balance speed (MVP in 6-8 hours), learning (expose you to real patterns), and scalability (easily extend to Phase 2+).**

