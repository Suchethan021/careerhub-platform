import { supabase } from './supabase';
import type { ContentSection, ApiResponse } from '../types';

export async function getContentSectionsByCompanyId(companyId: string): Promise<ApiResponse<ContentSection[]>> {
  try {
    const { data, error } = await supabase
      .from('content_sections')
      .select('*')
      .eq('company_id', companyId)
      .is('deleted_at', null)
      .order('order_index', { ascending: true });

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error fetching content sections:', error);
    return { data: null, error: (error as Error).message };
  }
}

export async function saveContentSections(
  companyId: string,
  sections: Partial<ContentSection>[]
): Promise<ApiResponse<ContentSection[]>> {
  try {
    // First, fetch existing sections to determine which ones need to be updated vs inserted
    const { data: existingSections } = await supabase
      .from('content_sections')
      .select('*')
      .eq('company_id', companyId);

    const sectionsToUpsert = [];
    const sectionsToUpdate = [];

    // Prepare sections for upsert/update
    for (const section of sections) {
      const existingSection = existingSections?.find(s => s.type === section.type);
      
      const sectionData = {
        id: section.id || existingSection?.id || crypto.randomUUID(),
        company_id: companyId,
        type: section.type,
        order_index: section.order_index ?? 0,
        is_visible: section.is_visible ?? true,
        title: section.title ?? '',
        content: section.content ?? '',
        image_urls: section.image_urls ?? [],
        created_at: section.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: section.deleted_at ?? null,
      };

      if (existingSection) {
        // Update existing section
        sectionsToUpdate.push({
          ...sectionData,
          id: existingSection.id,
          created_at: existingSection.created_at, // Preserve original creation time
        });
      } else {
        // New section
        sectionsToUpsert.push(sectionData);
      }
    }

    // Perform updates and inserts in a transaction
    const { data: savedSections, error: saveError } = await supabase
      .from('content_sections')
      .upsert([...sectionsToUpdate, ...sectionsToUpsert])
      .select()
      .order('order_index', { ascending: true });

    if (saveError) throw saveError;
    if (!savedSections) throw new Error('No data returned from save operation');

    return { data: savedSections, error: null };
  } catch (error) {
    console.error('Error saving content sections:', error);
    return { data: null, error: (error as Error).message };
  }
}
