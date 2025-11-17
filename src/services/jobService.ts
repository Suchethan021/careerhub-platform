import { supabase } from './supabase';
import type { Job, ApiResponse, ApiError } from '../types';

// ============================================================================
// CREATE JOB
// ============================================================================

export async function createJob(
  job: Omit<Job, 'id' | 'created_at' | 'updated_at'> & { created_by: string }
): Promise<ApiResponse<Job>> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert(job)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: (err as ApiError).message || 'Failed to create job' };
  }
}

// ============================================================================
// GET JOBS BY COMPANY (RECRUITER VIEW - All statuses)
// ============================================================================

export async function getJobsByCompany(company_id: string): Promise<ApiResponse<Job[]>> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('company_id', company_id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data || [], error: null };
  } catch (err) {
    return { data: null, error: (err as ApiError).message || 'Failed to fetch jobs' };
  }
}

// ============================================================================
// GET OPEN JOBS BY COMPANY (CANDIDATE VIEW - Only open jobs)
// ============================================================================

export async function getOpenJobsByCompany(company_id: string): Promise<ApiResponse<Job[]>> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('company_id', company_id)
      .eq('status', 'open')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data || [], error: null };
  } catch (err) {
    return { data: null, error: (err as ApiError).message || 'Failed to fetch jobs' };
  }
}

// ============================================================================
// UPDATE JOB
// ============================================================================

export async function updateJob(
  job_id: string,
  updates: Partial<Job>,
  updated_by: string
): Promise<ApiResponse<Job>> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .update({
        ...updates,
        updated_by,
        updated_at: new Date().toISOString()
      })
      .eq('id', job_id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: (err as ApiError).message || 'Failed to update job' };
  }
}

// ============================================================================
// DELETE JOB (SOFT DELETE)
// ============================================================================

export async function deleteJob(job_id: string, updated_by: string): Promise<ApiResponse<Job>> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .update({
        deleted_at: new Date().toISOString(),
        updated_by,
        updated_at: new Date().toISOString()
      })
      .eq('id', job_id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: (err as ApiError).message || 'Failed to delete job' };
  }
}
