import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../services/supabase';

type FileType = 'logo' | 'banner' | 'video';

export async function uploadCompanyAsset(
  file: File,
  companyId: string,
  type: FileType
): Promise<{ path: string; error: Error | null }> {
  try {
    // Generate a unique filename with the original extension
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${companyId}/${type}s/${fileName}`;
    
    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('company-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('company-assets')
      .getPublicUrl(filePath);

    return { path: publicUrl, error: null };
  } catch (error) {
    console.error(`Error uploading ${type}:`, error);
    return { path: '', error: error as Error };
  }
}

export async function deleteCompanyAsset(fileUrl: string): Promise<{ error: Error | null }> {
  try {
    // Extract the file path from the URL
    const filePath = fileUrl.split('company-assets/')[1];
    if (!filePath) {
      throw new Error('Invalid file URL');
    }

    const { error } = await supabase.storage
      .from('company-assets')
      .remove([filePath]);

    return { error };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { error: error as Error };
  }
}
