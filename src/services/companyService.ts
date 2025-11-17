import { supabase } from './supabase';
import type { Company, ApiResponse, ApiError } from '../types';

// ============================================================================
// CREATE COMPANY
// ============================================================================

export async function createCompany(
  name: string,
  slug: string,
  recruiter_id: string
): Promise<ApiResponse<Company>> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .insert({
        name,
        slug,
        recruiter_id,
        created_by: recruiter_id
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: (err as ApiError).message || 'Failed to create company' };
  }
}

// ============================================================================
// GET COMPANY BY SLUG (PUBLIC - For Candidates)
// ============================================================================

export async function getCompanyBySlug(slug: string): Promise<ApiResponse<Company>> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: (err as ApiError).message || 'Company not found' };
  }
}

// ============================================================================
// GET RECRUITER'S COMPANY
// ============================================================================

export async function getRecruiterCompany(recruiter_id: string): Promise<ApiResponse<Company>> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('recruiter_id', recruiter_id)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: (err as ApiError).message || 'Company not found' };
  }
}

// ============================================================================
// UPDATE COMPANY
// ============================================================================

export async function updateCompany(
  company_id: string,
  updates: Partial<Company>,
  updated_by: string
): Promise<ApiResponse<Company>> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .update({
        ...updates,
        updated_by,
        updated_at: new Date().toISOString()
      })
      .eq('id', company_id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: (err as ApiError).message || 'Failed to update company' };
  }
}

// ============================================================================
// PUBLISH COMPANY
// ============================================================================

export async function publishCompany(company_id: string, updated_by: string): Promise<ApiResponse<Company>> {
  return updateCompany(company_id, { is_published: true }, updated_by);
}

// ============================================================================
// UNPUBLISH COMPANY
// ============================================================================

export async function unpublishCompany(company_id: string, updated_by: string): Promise<ApiResponse<Company>> {
  return updateCompany(company_id, { is_published: false }, updated_by);
}
