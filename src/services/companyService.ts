import { supabase } from './supabase';
import type { Company, ApiResponse } from '../types';

export async function getCompanyByUserId(userId: string): Promise<ApiResponse<Company>> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('recruiter_id', userId)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching company:', error);
    return { data: null, error: (error as Error).message };
  }
}

export async function getCompanyById(id: string): Promise<ApiResponse<Company>> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching company:', error);
    return { data: null, error: (error as Error).message };
  }
}

export async function createCompany(company: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Company>> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .insert([company])
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error creating company:', error);
    return { data: null, error: (error as Error).message };
  }
}

export async function updateCompany(id: string, updates: Partial<Company>): Promise<ApiResponse<Company>> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error updating company:', error);
    return { data: null, error: (error as Error).message };
  }
}

export async function getCompanyBySlug(slug: string): Promise<ApiResponse<Company>> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching company:', error);
    return { data: null, error: (error as Error).message };
  }
}

export async function getPublishedCompanies(): Promise<ApiResponse<Company[]>> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching published companies:', error);
    return { data: null, error: (error as Error).message };
  }
}

