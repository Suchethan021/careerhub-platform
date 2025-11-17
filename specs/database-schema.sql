-- CareerHub Platform: Complete Database Schema
-- Version: 1.0
-- Created: November 16, 2025
-- Author: Suchethan Kummajella

-- ============================================================================
-- SETUP: Enable Required Extensions
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "plpgsql";

-- ============================================================================
-- COMPANIES TABLE: Store company profiles and branding
-- ============================================================================

CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Core fields
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  recruiter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Branding
  logo_url VARCHAR(500),
  banner_url VARCHAR(500),
  primary_color VARCHAR(7) DEFAULT '#0066CC',
  secondary_color VARCHAR(7) DEFAULT '#FF6B6B',
  accent_color VARCHAR(7) DEFAULT '#FFD93D',
  font_family VARCHAR(100) DEFAULT 'inter',
  mission_statement TEXT,
  
  -- Video (YouTube embed URL or storage path)
  culture_video_url VARCHAR(500),
  
  -- Publishing
  is_published BOOLEAN DEFAULT FALSE,
  
  -- Audit trail
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
  )
);

CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_companies_recruiter_id ON companies(recruiter_id);
CREATE INDEX idx_companies_created_at ON companies(created_at DESC);

-- ============================================================================
-- JOBS TABLE: Store job postings
-- ============================================================================

CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign key
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Job details
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255),
  job_type VARCHAR(50) DEFAULT 'full-time',
  salary_min DECIMAL(10, 2),
  salary_max DECIMAL(10, 2),
  salary_currency VARCHAR(3),
  experience_level VARCHAR(50) DEFAULT 'mid',
  
  -- Status
  status VARCHAR(50) DEFAULT 'open',
  
  -- Audit trail
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL,
  
  -- Planned features
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- Constraints
  CONSTRAINT job_type_valid CHECK (job_type IN ('full-time', 'part-time', 'contract', 'internship')),
  CONSTRAINT experience_level_valid CHECK (experience_level IN ('entry', 'mid', 'senior')),
  CONSTRAINT status_valid CHECK (status IN ('open', 'closed', 'draft')),
  CONSTRAINT salary_range_valid CHECK (salary_min IS NULL OR salary_max IS NULL OR salary_min <= salary_max)
);

CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_company_status ON jobs(company_id, status);
CREATE INDEX idx_jobs_deleted_at ON jobs(deleted_at);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);

-- ============================================================================
-- CONTENT_SECTIONS TABLE: Store reorderable page sections
-- ============================================================================

CREATE TABLE IF NOT EXISTS content_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign key
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Section configuration
  type VARCHAR(100) NOT NULL,
  order_index INTEGER NOT NULL,
  is_visible BOOLEAN DEFAULT TRUE,
  
  -- Content
  title VARCHAR(255),
  content TEXT,
  image_urls JSONB DEFAULT '[]'::jsonb,
  
  -- Audit trail
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL,
  
  -- Constraints
  CONSTRAINT section_type_valid CHECK (type IN ('about', 'mission', 'life', 'perks', 'team', 'faqs')),
  CONSTRAINT unique_section_per_company UNIQUE (company_id, type)
);

CREATE INDEX idx_content_sections_company_id ON content_sections(company_id);
CREATE INDEX idx_content_sections_order ON content_sections(company_id, order_index);
CREATE INDEX idx_content_sections_deleted_at ON content_sections(deleted_at);

-- ============================================================================
-- FAQS TABLE: Store FAQs for content sections
-- ============================================================================

CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign key
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- FAQ content
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  
  -- Audit trail
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL,
  
  -- Constraints
  CONSTRAINT unique_faq_order UNIQUE (company_id, order_index)
);

CREATE INDEX idx_faqs_company_order ON faqs(company_id, order_index);
CREATE INDEX idx_faqs_deleted_at ON faqs(deleted_at);

-- ============================================================================
-- VIDEO_UPLOADS TABLE: Store metadata for uploaded videos (Planned)
-- ============================================================================

CREATE TABLE IF NOT EXISTS video_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign key
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- File details
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER COMMENT 'Size in bytes',
  mime_type VARCHAR(100),
  storage_path VARCHAR(500),
  duration INTEGER COMMENT 'Duration in seconds',
  
  -- Status
  upload_status VARCHAR(50) DEFAULT 'completed',
  
  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT upload_status_valid CHECK (upload_status IN ('pending', 'completed', 'failed')),
  CONSTRAINT mime_type_valid CHECK (mime_type IN ('video/mp4', 'video/webm'))
);

CREATE INDEX idx_video_uploads_company_id ON video_uploads(company_id);
CREATE INDEX idx_video_uploads_created_at ON video_uploads(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS): Multi-Tenancy Authorization
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_uploads ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- COMPANIES RLS POLICIES
-- ============================================================================

-- Policy 1: Recruiters can see/modify only their own company
CREATE POLICY recruiter_company_access ON companies
FOR ALL
USING (recruiter_id = auth.uid())
WITH CHECK (recruiter_id = auth.uid());

-- Policy 2: Candidates can see only published companies
CREATE POLICY candidate_company_access ON companies
FOR SELECT
USING (is_published = TRUE);

-- ============================================================================
-- JOBS RLS POLICIES
-- ============================================================================

-- Policy 1: Recruiters can manage jobs of their own company
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

-- Policy 2: Candidates can view only open jobs from published companies
CREATE POLICY candidate_jobs_access ON jobs
FOR SELECT
USING (
  company_id IN (
    SELECT id FROM companies WHERE is_published = TRUE
  )
  AND status = 'open'
  AND deleted_at IS NULL
);

-- ============================================================================
-- CONTENT_SECTIONS RLS POLICIES
-- ============================================================================

-- Policy 1: Recruiters can manage sections of their own company
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

-- Policy 2: Candidates can view only visible sections from published companies
CREATE POLICY candidate_sections_access ON content_sections
FOR SELECT
USING (
  company_id IN (
    SELECT id FROM companies WHERE is_published = TRUE
  )
  AND is_visible = TRUE
  AND deleted_at IS NULL
);

-- ============================================================================
-- FAQS RLS POLICIES
-- ============================================================================

-- Policy 1: Recruiters can manage FAQs of their own company
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

-- Policy 2: Candidates can view FAQs from published companies
CREATE POLICY candidate_faqs_access ON faqs
FOR SELECT
USING (
  company_id IN (
    SELECT id FROM companies WHERE is_published = TRUE
  )
  AND deleted_at IS NULL
);

-- ============================================================================
-- VIDEO_UPLOADS RLS POLICIES
-- ============================================================================

-- Policy 1: Recruiters can manage videos of their own company
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

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Function: Reorder content sections atomically
CREATE OR REPLACE FUNCTION reorder_content_sections(
  p_company_id UUID,
  p_sections_data JSONB
)
RETURNS JSON AS $$
DECLARE
  v_section_id UUID;
  v_new_order INTEGER;
  v_count INTEGER := 0;
BEGIN
  -- Check authorization: user must own the company
  IF NOT EXISTS (
    SELECT 1 FROM companies 
    WHERE id = p_company_id 
    AND recruiter_id = auth.uid()
  ) THEN
    RETURN json_build_object('error', 'Unauthorized');
  END IF;

  -- Update order_index for each section
  FOR v_section_id, v_new_order IN
    SELECT 
      (elem->>'id')::uuid,
      (elem->>'order_index')::integer
    FROM jsonb_array_elements(p_sections_data) AS elem
  LOOP
    UPDATE content_sections
    SET order_index = v_new_order,
        updated_by = auth.uid(),
        updated_at = NOW()
    WHERE id = v_section_id
    AND company_id = p_company_id;
    
    v_count := v_count + 1;
  END LOOP;

  RETURN json_build_object(
    'success', true,
    'updated_count', v_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Publish company page
CREATE OR REPLACE FUNCTION publish_company_page(p_company_id UUID)
RETURNS JSON AS $$
BEGIN
  -- Check authorization
  IF NOT EXISTS (
    SELECT 1 FROM companies 
    WHERE id = p_company_id 
    AND recruiter_id = auth.uid()
  ) THEN
    RETURN json_build_object('error', 'Unauthorized');
  END IF;

  -- Validate required fields
  IF NOT EXISTS (
    SELECT 1 FROM companies 
    WHERE id = p_company_id
    AND name IS NOT NULL
    AND slug IS NOT NULL
    AND (logo_url IS NOT NULL OR banner_url IS NOT NULL)
  ) THEN
    RETURN json_build_object(
      'error',
      'Missing required fields: name, slug, logo or banner'
    );
  END IF;

  -- Update published status
  UPDATE companies
  SET is_published = TRUE,
      updated_by = auth.uid(),
      updated_at = NOW()
  WHERE id = p_company_id;

  RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SEED SAMPLE DATA (Optional - Run Separately)
-- ============================================================================

-- Note: Run after creating sample user in Supabase Auth
-- Insert sample company:
-- INSERT INTO companies (name, slug, recruiter_id, primary_color, mission_statement, is_published, created_by)
-- VALUES (
--   'Tech Corp India',
--   'tech-corp-india',
--   'USER-UUID-HERE',
--   '#0066CC',
--   'Building amazing products with modern technology',
--   false,
--   'USER-UUID-HERE'
-- );

-- ============================================================================
-- UTILITY VIEWS (Optional - For Easier Querying)
-- ============================================================================

-- View: Active jobs by company
CREATE OR REPLACE VIEW active_jobs_by_company AS
SELECT 
  c.id as company_id,
  c.name as company_name,
  c.slug as company_slug,
  COUNT(j.id) as job_count
FROM companies c
LEFT JOIN jobs j ON j.company_id = c.id AND j.deleted_at IS NULL AND j.status = 'open'
WHERE c.is_published = TRUE
GROUP BY c.id, c.name, c.slug;

-- View: Company statistics
CREATE OR REPLACE VIEW company_stats AS
SELECT 
  c.id,
  c.name,
  c.slug,
  COUNT(DISTINCT j.id) as total_jobs,
  COUNT(DISTINCT CASE WHEN j.status = 'open' THEN j.id END) as open_jobs,
  COUNT(DISTINCT CASE WHEN j.status = 'closed' THEN j.id END) as closed_jobs,
  COUNT(DISTINCT CASE WHEN j.deleted_at IS NOT NULL THEN j.id END) as deleted_jobs,
  COUNT(DISTINCT cs.id) as content_sections,
  COUNT(DISTINCT f.id) as faqs
FROM companies c
LEFT JOIN jobs j ON j.company_id = c.id
LEFT JOIN content_sections cs ON cs.company_id = c.id AND cs.deleted_at IS NULL
LEFT JOIN faqs f ON f.company_id = c.id AND f.deleted_at IS NULL
GROUP BY c.id, c.name, c.slug;

-- ============================================================================
-- COMMENTS & DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE companies IS 'Stores company profiles and branding configuration';
COMMENT ON TABLE jobs IS 'Stores job postings with audit trail (soft deletes)';
COMMENT ON TABLE content_sections IS 'Stores reorderable content sections for company pages';
COMMENT ON TABLE faqs IS 'Stores FAQ items with ordering';
COMMENT ON TABLE video_uploads IS 'Stores metadata for uploaded videos (planned feature)';

COMMENT ON COLUMN companies.slug IS 'URL-safe unique identifier (e.g., tech-corp-india)';
COMMENT ON COLUMN companies.recruiter_id IS 'Foreign key to auth.users - who owns this company';
COMMENT ON COLUMN jobs.status IS 'open = visible to candidates, closed = no longer recruiting, draft = not yet published';
COMMENT ON COLUMN jobs.deleted_at IS 'Soft delete timestamp - NULL means active record';
COMMENT ON COLUMN content_sections.order_index IS 'Used for drag-drop reordering - lower numbers appear first';
COMMENT ON COLUMN content_sections.type IS 'Predefined section types: about, mission, life, perks, team, faqs';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

-- To test RLS policies, run:
-- SELECT * FROM companies;  -- Should only show your company
-- SELECT * FROM jobs;       -- Should only show your company's jobs
-- SELECT * FROM content_sections;  -- Should only show your sections

