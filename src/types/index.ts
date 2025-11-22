// ============================================================================
// DATABASE TYPES - MATCH ACTUAL SCHEMA
// ============================================================================

export interface Company {
  id: string;
  
  // Core fields
  name: string;
  slug: string;
  recruiter_id: string;
  
  // Branding - Storage paths (NOT URLs)
  logo_storage_path?: string | null;
  banner_storage_path?: string | null;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  font_family?: string;
  mission_statement?: string | null;
  
  // Video
  culture_video_youtube_url?: string | null;
  culture_video_upload_path?: string | null;
  culture_video_type?: 'youtube' | 'upload' | null;
  
  // Publishing
  is_published: boolean;
  
  // Audit trail
  created_by?: string | null;
  created_at: string;
  updated_by?: string | null;
  updated_at: string;
}

export interface Job {
  id: string;
  
  // Foreign key
  company_id: string;
  
  // Job details
  title: string;
  description: string;
  location?: string | null;
  job_type: 'full-time' | 'part-time' | 'contract' | 'internship';
  
  // Salary - Multiple formats
  salary_min?: number | null;
  salary_max?: number | null;
  salary_currency?: string | null;
  salary_period?: 'monthly' | 'yearly' | null;
  salary_range_string?: string | null;
  
  // Experience & Status
  experience_level: 'entry' | 'mid' | 'senior';
  status: 'open' | 'closed' | 'draft';
  
  // Audit trail
  created_by?: string | null;
  created_at: string;
  updated_by?: string | null;
  updated_at: string;
  deleted_at?: string | null;
  
  // Features
  is_featured: boolean;
}

export interface ContentSection {
  id: string;
  company_id: string;
  type: 'about' | 'mission' | 'life' | 'perks' | 'team' | 'faqs';
  order_index: number;
  is_visible: boolean;
  title?: string | null;
  content?: string | null;
  image_urls?: string[]; // Array of storage paths
  created_by?: string | null;
  created_at: string;
  updated_by?: string | null;
  updated_at: string;
  deleted_at?: string | null;
}

export interface FAQ {
  id: string;
  company_id: string;
  question: string;
  answer: string;
  order_index: number;
  created_by?: string | null;
  created_at: string;
  updated_by?: string | null;
  updated_at: string;
  deleted_at?: string | null;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

// Supabase auth user shape used by AuthProvider
export interface AuthUser {
  id: string;
  email: string;
  email_confirmed_at: string | null;
  user_metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at?: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// ✅ ADD THIS NEW INTERFACE:
export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// ✅ ADD HELPER FUNCTION:
export function createApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR'
    };
  }
  if (typeof error === 'string') {
    return {
      message: error,
      code: 'STRING_ERROR'
    };
  }
  return {
    message: 'An unexpected error occurred',
    code: 'UNEXPECTED_ERROR',
    details: error
  };
}

