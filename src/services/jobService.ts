import { supabase } from './supabase';
import type { Job, ApiResponse } from '../types';

export async function getJobs(): Promise<ApiResponse<Job[]>> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return { data: null, error: (error as Error).message };
  }
}

export async function getJobsByCompanyId(companyId: string): Promise<ApiResponse<Job[]>> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('company_id', companyId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return { data: null, error: (error as Error).message };
  }
}

export async function createJob(job: Omit<Job, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Job>> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .insert([job])
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error creating job:', error);
    return { data: null, error: (error as Error).message };
  }
}

export async function updateJob(id: string, updates: Partial<Job>): Promise<ApiResponse<Job>> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error updating job:', error);
    return { data: null, error: (error as Error).message };
  }
}

export async function deleteJob(id: string): Promise<ApiResponse<Job>> {
  try {
    // Soft delete - set deleted_at timestamp
    const { data, error } = await supabase
      .from('jobs')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error deleting job:', error);
    return { data: null, error: (error as Error).message };
  }
}
