import { useState } from 'react';
import type { Company } from '../../types';
import { FiSave, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { FileUpload } from '../common/FileUpload';
import { uploadCompanyAsset } from '../../utils/storage';

interface CompanyFormProps {
  company?: Company | null;
  onSave: (data: Partial<Company>) => Promise<void>;
  onCancel?: () => void;
}

export function CompanyForm({ company, onSave, onCancel }: CompanyFormProps) {
  const [formData, setFormData] = useState<Partial<Company>>({
    name: company?.name ?? '',
    slug: company?.slug ?? '',
    mission_statement: company?.mission_statement ?? '',
    logo_storage_path: company?.logo_storage_path ?? '',
    banner_storage_path: company?.banner_storage_path ?? '',
    primary_color: company?.primary_color ?? '#0066CC',
    secondary_color: company?.secondary_color ?? '#FF6B6B',
    accent_color: company?.accent_color ?? '#FFD93D',
    font_family: company?.font_family ?? 'inter',
    culture_video_youtube_url: company?.culture_video_youtube_url ?? '',
    culture_video_upload_path: company?.culture_video_upload_path ?? '',
    culture_video_type: company?.culture_video_type ?? null,
    is_published: company?.is_published ?? false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => {
      // Special handling for YouTube URL so we also set the video type
      if (name === 'culture_video_youtube_url') {
        const url = value;
        return {
          ...prev,
          culture_video_youtube_url: url,
          culture_video_type: url ? 'youtube' : prev.culture_video_type === 'youtube' ? null : prev.culture_video_type ?? null,
        };
      }

      return {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      } as Partial<Company>;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      await onSave(formData);
    } catch (err) {
      setError('Failed to save company profile. Please try again.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-generate slug from company name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug || slug, // Only auto-fill if slug is empty
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {company ? 'Edit Company Profile' : 'Create Company Profile'}
        </h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
          >
            <FiX size={24} />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name ?? ''}
                onChange={handleNameChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                placeholder="Acme Corporation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug *
              </label>
              <input
                type="text"
                name="slug"
                required
                value={formData.slug ?? ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                placeholder="acme-corporation"
              />
              <p className="mt-1 text-xs text-gray-500">
                Your careers page will be at: /{formData.slug || 'your-slug'}/careers
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mission Statement
            </label>
            <textarea
              name="mission_statement"
              value={formData.mission_statement ?? ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              placeholder="Our mission is to..."
            />
          </div>
        </div>

        {/* Brand Assets */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Brand Assets</h3>

          <FileUpload
            label="Company Logo"
            accept="image/*"
            value={(formData.logo_storage_path as string) || ''}
            onChange={(url) =>
              setFormData((prev) => ({ ...prev, logo_storage_path: url }))
            }
            onError={setError}
            maxSizeMB={5}
            onUploadFile={company
              ? async (file) => {
                  const { path, error } = await uploadCompanyAsset(
                    file,
                    company.id,
                    'logo',
                  );
                  if (error) throw error;
                  return path;
                }
              : undefined}
            className="md:col-span-2"
          />

          <FileUpload
            label="Banner Image"
            accept="image/*"
            value={(formData.banner_storage_path as string) || ''}
            onChange={(url) =>
              setFormData((prev) => ({ ...prev, banner_storage_path: url }))
            }
            onError={setError}
            maxSizeMB={5}
            onUploadFile={company
              ? async (file) => {
                  const { path, error } = await uploadCompanyAsset(
                    file,
                    company.id,
                    'banner',
                  );
                  if (error) throw error;
                  return path;
                }
              : undefined}
            className="md:col-span-2"
          />
        </div>

        {/* Brand Colors */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Brand Colors</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  name="primary_color"
                  value={formData.primary_color ?? '#0066CC'}
                  onChange={handleChange}
                  className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.primary_color ?? ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, primary_color: e.target.value }))
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  placeholder="#0066CC"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  name="secondary_color"
                  value={formData.secondary_color ?? '#FF6B6B'}
                  onChange={handleChange}
                  className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.secondary_color ?? ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, secondary_color: e.target.value }))
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  placeholder="#FF6B6B"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  name="accent_color"
                  value={formData.accent_color ?? '#FFD93D'}
                  onChange={handleChange}
                  className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.accent_color ?? ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, accent_color: e.target.value }))
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  placeholder="#FFD93D"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Typography</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Family
            </label>
            <select
              name="font_family"
              value={formData.font_family ?? 'inter'}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              <option value="inter">Inter (Modern Sans-serif)</option>
              <option value="roboto">Roboto (Google Sans-serif)</option>
              <option value="open-sans">Open Sans (Clean Sans-serif)</option>
              <option value="lato">Lato (Friendly Sans-serif)</option>
              <option value="montserrat">Montserrat (Geometric Sans-serif)</option>
              <option value="poppins">Poppins (Rounded Sans-serif)</option>
            </select>
          </div>
        </div>

        {/* Culture Video */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Culture Video</h3>

          <FileUpload
            label="Upload Culture Video"
            accept="video/*"
            value={(formData.culture_video_upload_path as string) || ''}
            onChange={(url) =>
              setFormData((prev) => ({
                ...prev,
                culture_video_upload_path: url,
                culture_video_type: url ? 'upload' : prev.culture_video_type,
              }))
            }
            onError={setError}
            maxSizeMB={50}
            onUploadFile={company
              ? async (file) => {
                  const { path, error } = await uploadCompanyAsset(
                    file,
                    company.id,
                    'video',
                  );
                  if (error) throw error;
                  return path;
                }
              : undefined}
            className="md:col-span-2"
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube Video URL
            </label>
            <input
              type="url"
              name="culture_video_youtube_url"
              value={(formData.culture_video_youtube_url as string) || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              placeholder="https://www.youtube.com/embed/VIDEO_ID"
            />
            <p className="mt-1 text-xs text-gray-500">
              Use the embed URL format from YouTube
            </p>
            {formData.culture_video_youtube_url && (
              <div className="mt-4 aspect-video rounded-xl overflow-hidden bg-black">
                <iframe
                  src={formData.culture_video_youtube_url as string}
                  title="Culture video preview"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </div>

        {/* Publishing Status */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Publishing</h3>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_published"
              checked={formData.is_published}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">
                Publish careers page
              </span>
              <p className="text-xs text-gray-500">
                Make your careers page visible to candidates
              </p>
            </div>
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <FiSave size={18} />
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}