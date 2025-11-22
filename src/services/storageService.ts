import type { ApiResponse } from "../types";
import { uploadCompanyAsset, deleteCompanyAsset } from "../utils/storage";

export async function uploadCompanyImage(
  companyId: string,
  file: File,
  type: 'logo' | 'banner'
): Promise<ApiResponse<string>> {
  try {
    const { path, error } = await uploadCompanyAsset(file, companyId, type);
    if (error) {
      return { data: null, error: error.message };
    }
    return { data: path, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to upload image';
    return { data: null, error: message };
  }
}

export async function deleteCompanyImage(
  path: string
): Promise<ApiResponse<void>> {
  try {
    const { error } = await deleteCompanyAsset(path);
    if (error) {
      return { data: null, error: error.message };
    }
    return { data: undefined, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete image';
    return { data: null, error: message };
  }
}
