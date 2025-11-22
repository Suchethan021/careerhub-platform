import { supabase } from './supabase';
import type { FAQ, ApiResponse } from '../types';

export async function getFaqsByCompanyId(companyId: string): Promise<ApiResponse<FAQ[]>> {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('company_id', companyId)
      .is('deleted_at', null)
      .order('order_index', { ascending: true });

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return { data: null, error: (error as Error).message };
  }
}

export async function saveFaqs(
  companyId: string,
  faqs: Partial<FAQ>[]
): Promise<ApiResponse<FAQ[]>> {
  try {
    const payload = faqs.map((faq, index) => ({
      id: faq.id,
      company_id: companyId,
      question: faq.question,
      answer: faq.answer,
      order_index: faq.order_index ?? index,
      deleted_at: faq.deleted_at ?? null,
    }));

    const { data, error } = await supabase
      .from('faqs')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .order('order_index', { ascending: true });

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error saving FAQs:', error);
    return { data: null, error: (error as Error).message };
  }
}
