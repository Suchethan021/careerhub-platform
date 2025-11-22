# CareerHub: Step-by-Step SQL Schema Setup

This file breaks down the database schema into **manageable steps**. Run each step separately so you understand what's happening.

---

## STEP 1: Enable Required Extensions

Copy this into Supabase SQL Editor and run:

```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable additional functions
CREATE EXTENSION IF NOT EXISTS "plpgsql";
```

**What this does:**
- `uuid-ossp`: Allows us to generate unique IDs automatically
- `plpgsql`: Enables procedural SQL (for complex operations)

**Run this first, then wait for success message.**

---

## STEP 2: Create COMPANIES Table

```sql
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Core Info
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  recruiter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Branding - Storage Paths (NOT URLs)
  logo_storage_path VARCHAR(500),              -- e.g., "logos/company-123/logo.png"
  banner_storage_path VARCHAR(500),            -- e.g., "banners/company-123/banner.jpg"
  primary_color VARCHAR(7) DEFAULT '#0066CC',
  secondary_color VARCHAR(7) DEFAULT '#FF6B6B',
  accent_color VARCHAR(7) DEFAULT '#FFD93D',
  font_family VARCHAR(100) DEFAULT 'inter',
  mission_statement TEXT,
  
  -- Video - SEPARATE COLUMNS FOR YOUTUBE vs UPLOAD
  culture_video_youtube_url VARCHAR(500),      -- YouTube embed URL (optional)
  culture_video_upload_path VARCHAR(500),      -- Storage path for direct upload (optional)
  culture_video_type VARCHAR(50),              -- 'youtube', 'upload', or NULL
  
  -- Publishing
  is_published BOOLEAN DEFAULT FALSE,
  
  -- Audit Trail
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  CONSTRAINT color_format CHECK (
    primary_color ~ '^#[0-9A-Fa-f]{6}$' AND
    secondary_color ~ '^#[0-9A-Fa-f]{6}$' AND
    accent_color ~ '^#[0-9A-Fa-f]{6}$'
  ),
  CONSTRAINT video_type_valid CHECK (culture_video_type IN ('youtube', 'upload'))
);

-- Indexes for fast queries
CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_companies_recruiter_id ON companies(recruiter_id);
CREATE INDEX idx_companies_is_published ON companies(is_published);
```

**What this does:**
- Creates companies table with all branding fields
- Uses **storage paths** (not URLs) for images and videos
- Has separate columns for YouTube vs upload videos
- Includes constraints (format validation for colors, slug)
- Creates indexes for fast lookups

**Run this, wait for success message.**

---

## STEP 3: Create JOBS Table

```sql
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign Key
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Job Details
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255),
  job_type VARCHAR(50) DEFAULT 'full-time',
  
  -- Salary - NOW HANDLES MULTIPLE FORMATS
  salary_min NUMERIC(12, 2),           -- Numeric value (e.g., 8000)
  salary_max NUMERIC(12, 2),           -- Numeric value (e.g., 12000)
  salary_currency VARCHAR(10),         -- Currency code (AED, USD, INR, SAR, etc.)
  salary_period VARCHAR(50),           -- 'monthly', 'yearly', or NULL
  salary_range_string VARCHAR(255),    -- Original string from data (e.g., "AED 8K–12K / month")
  
  -- Experience & Status
  experience_level VARCHAR(50) DEFAULT 'mid',
  status VARCHAR(50) DEFAULT 'open',
  
  -- Audit Trail
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL,           -- Soft delete
  
  -- Planned Features
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- Constraints
  CONSTRAINT job_type_valid CHECK (job_type IN ('full-time', 'part-time', 'contract', 'internship')),
  CONSTRAINT experience_level_valid CHECK (experience_level IN ('entry', 'mid', 'senior')),
  CONSTRAINT status_valid CHECK (status IN ('open', 'closed', 'draft')),
  CONSTRAINT salary_range_valid CHECK (salary_min IS NULL OR salary_max IS NULL OR salary_min <= salary_max),
  CONSTRAINT salary_period_valid CHECK (salary_period IN ('monthly', 'yearly'))
);

-- Indexes
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_company_status ON jobs(company_id, status);
CREATE INDEX idx_jobs_deleted_at ON jobs(deleted_at);
CREATE INDEX idx_jobs_experience ON jobs(experience_level);
```

**What this does:**
- Stores salary as structured data (salary_min, salary_max, currency, period)
- Also keeps original string (salary_range_string) for reference
- Handles multiple currencies and time periods
- Uses soft deletes (deleted_at) to preserve history
- Constraints prevent bad data

**Run this, wait for success.**

---

## STEP 4: Create CONTENT_SECTIONS Table

```sql
CREATE TABLE IF NOT EXISTS content_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign Key
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Section Config
  type VARCHAR(100) NOT NULL,
  order_index INTEGER NOT NULL,
  is_visible BOOLEAN DEFAULT TRUE,
  
  -- Content
  title VARCHAR(255),
  content TEXT,
  image_urls JSONB DEFAULT '[]'::jsonb,  -- Array of storage paths
  
  -- Audit Trail
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL,
  
  -- Constraints
  CONSTRAINT section_type_valid CHECK (type IN ('about', 'mission', 'life', 'perks', 'team', 'faqs')),
  CONSTRAINT unique_section_per_company UNIQUE (company_id, type)
);

-- Indexes
CREATE INDEX idx_content_sections_company_id ON content_sections(company_id);
CREATE INDEX idx_content_sections_order ON content_sections(company_id, order_index);
```

**What this does:**
- `image_urls JSONB`: Array of image storage paths (e.g., ["img1.jpg", "img2.jpg"])
- `order_index`: Position for drag-drop reordering
- `is_visible`: Can hide section without deleting
- Soft deletes for audit trail

**Run this, wait for success.**

---

## STEP 5: Create FAQS Table

```sql
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign Key
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- FAQ Content
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  
  -- Audit Trail
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL,
  
  -- Constraint
  CONSTRAINT unique_faq_order UNIQUE (company_id, order_index)
);

-- Index
CREATE INDEX idx_faqs_company_id ON faqs(company_id);
```

**What this does:**
- Stores FAQs with ordering
- Part of the "faqs" content section type

**Run this, wait for success.**

---

## STEP 6: Create VIDEO_UPLOADS Table

```sql
CREATE TABLE IF NOT EXISTS video_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign Key
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- File Metadata
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER COMMENT 'Size in bytes',
  mime_type VARCHAR(100),
  storage_path VARCHAR(500),           -- Path in Supabase Storage
  duration INTEGER COMMENT 'Duration in seconds',
  
  -- Status
  upload_status VARCHAR(50) DEFAULT 'completed',
  
  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraint
  CONSTRAINT upload_status_valid CHECK (upload_status IN ('pending', 'completed', 'failed')),
  CONSTRAINT mime_type_valid CHECK (mime_type IN ('video/mp4', 'video/webm', 'video/quicktime'))
);

-- Index
CREATE INDEX idx_video_uploads_company_id ON video_uploads(company_id);
```

**What this does:**
- Stores video upload metadata
- For future video upload feature (Phase 2)

**Run this, wait for success.**

---

## STEP 7: Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_uploads ENABLE ROW LEVEL SECURITY;
```

**What this does:**
- Turns on database-level authorization
- Each query automatically filtered by user

**Run this, wait for success.**

---

## STEP 8: Create RLS Policies for COMPANIES

```sql
-- Policy 1: Recruiters see only their own company
CREATE POLICY recruiter_company_access ON companies
FOR ALL
USING (recruiter_id = auth.uid())
WITH CHECK (recruiter_id = auth.uid());

-- Policy 2: Candidates see only published companies
CREATE POLICY candidate_company_access ON companies
FOR SELECT
USING (is_published = TRUE);
```

**What this does:**
- Recruiters can only access their own company
- Candidates can only see published companies
- Automatic on all queries

**Run this, wait for success.**

---

## STEP 9: Create RLS Policies for JOBS

```sql
-- Policy 1: Recruiters manage their company's jobs
CREATE POLICY recruiter_jobs_access ON jobs
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

-- Policy 2: Candidates see only open jobs from published companies
CREATE POLICY candidate_jobs_access ON jobs
FOR SELECT
USING (
  company_id IN (
    SELECT id FROM companies WHERE is_published = TRUE
  )
  AND status = 'open'
  AND deleted_at IS NULL
);
```

**What this does:**
- Recruiters can manage only their company's jobs
- Candidates see only open jobs
- Soft-deleted jobs are hidden

**Run this, wait for success.**

---

## STEP 10: Create RLS Policies for CONTENT_SECTIONS

```sql
-- Policy 1: Recruiters manage their company's sections
CREATE POLICY recruiter_sections_access ON content_sections
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

-- Policy 2: Candidates see visible sections from published companies
CREATE POLICY candidate_sections_access ON content_sections
FOR SELECT
USING (
  company_id IN (
    SELECT id FROM companies WHERE is_published = TRUE
  )
  AND is_visible = TRUE
  AND deleted_at IS NULL
);
```

**Run this, wait for success.**

---

## STEP 11: Create RLS Policies for FAQS

```sql
-- Policy 1: Recruiters manage FAQs
CREATE POLICY recruiter_faqs_access ON faqs
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

-- Policy 2: Candidates see FAQs from published companies
CREATE POLICY candidate_faqs_access ON faqs
FOR SELECT
USING (
  company_id IN (
    SELECT id FROM companies WHERE is_published = TRUE
  )
  AND deleted_at IS NULL
);
```

**Run this, wait for success.**

---

## STEP 12: Create RLS Policies for VIDEO_UPLOADS

```sql
-- Recruiters manage their company's videos
CREATE POLICY recruiter_videos_access ON video_uploads
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
```

**Run this, wait for success.**


# Allow any authenticated user to read/write objects in company-assets
CREATE POLICY company_assets_authenticated_rw
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'company-assets')
WITH CHECK (bucket_id = 'company-assets');

# Allow everyone to read from company-assets (for non-public-url paths)
CREATE POLICY company_assets_public_read
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'company-assets');

---

## Summary of Changes from Original Schema

| Issue | Original | Updated |
|-------|----------|---------|
| **Video Handling** | Single `culture_video_url` | Separate `culture_video_youtube_url` + `culture_video_upload_path` + `culture_video_type` |
| **Image URLs** | `logo_url`, `banner_url` as URLs | `logo_storage_path`, `banner_storage_path` as storage paths |
| **Image Array** | `image_urls JSONB` (confusing) | `image_urls JSONB` with proper comment (array of storage paths) |
| **Salary** | Only `salary_min`, `salary_max` | Plus `salary_currency`, `salary_period`, `salary_range_string` |

---

## How to Run This

1. **Go to Supabase → SQL Editor**
2. **Copy each STEP separately** (STEP 1, then STEP 2, etc.)
3. **Run one at a time**
4. **Check for success message**
5. **Move to next step**

This way you understand what each creates!

