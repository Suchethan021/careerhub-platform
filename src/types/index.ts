// ============================================================================
// COMPANY TYPE
// ============================================================================

export interface Company {
  id: string;
  name: string;
  slug: string;
  recruiter_id: string;
  logo_storage_path: string | null;
  banner_storage_path: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_family: string;
  mission_statement: string | null;
  culture_video_youtube_url: string | null;
  culture_video_upload_path: string | null;
  culture_video_type: 'youtube' | 'upload' | null;
  is_published: boolean;
  created_by: string | null;
  created_at: string;
  updated_by: string | null;
  updated_at: string;
}

// ============================================================================
// JOB TYPE
// ============================================================================

export interface Job {
  id: string;
  company_id: string;
  title: string;
  description: string;
  location: string | null;
  job_type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  salary_period: 'monthly' | 'yearly' | null;
  salary_range_string: string | null;
  experience_level: 'entry' | 'mid' | 'senior';
  status: 'open' | 'closed' | 'draft';
  created_by: string | null;
  created_at: string;
  updated_by: string | null;
  updated_at: string;
  deleted_at: string | null;
  is_featured: boolean;
}

// ============================================================================
// CONTENT SECTION TYPE
// ============================================================================

export interface ContentSection {
  id: string;
  company_id: string;
  type: 'about' | 'mission' | 'life' | 'perks' | 'team' | 'faqs';
  order_index: number;
  is_visible: boolean;
  title: string | null;
  content: string | null;
  image_urls: string[] | null;
  created_by: string | null;
  created_at: string;
  updated_by: string | null;
  updated_at: string;
  deleted_at: string | null;
}

// ============================================================================
// FAQ TYPE
// ============================================================================

export interface FAQ {
  id: string;
  company_id: string;
  question: string;
  answer: string;
  order_index: number;
  created_by: string | null;
  created_at: string;
  updated_by: string | null;
  updated_at: string;
  deleted_at: string | null;
}

// ============================================================================
// AUTH USER TYPE - MATCHES SUPABASE AUTH.USERS EXACTLY
// ============================================================================

export interface UserMetadata {
  [key: string]: string | number | boolean | null | undefined;
}

export interface AuthUser {
  id: string;
  email: string;
  email_confirmed_at: string | null;
  user_metadata: UserMetadata | null;
  // These CAN be undefined from Supabase Auth
  created_at: string | undefined;
  updated_at: string | undefined;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface ApiError {
  message: string;
  code?: string;
}
