// src/components/common/FileUpload.tsx
import { FiX, FiImage, FiVideo } from 'react-icons/fi';
import { useState, useRef, type ChangeEvent } from 'react';

interface FileUploadProps {
  label: string;
  accept: string;
  value: string;
  onChange: (url: string) => void;
  onError?: (error: string) => void;
  maxSizeMB?: number;
  className?: string;
  onUploadFile?: (file: File) => Promise<string>;
}

export function FileUpload({
  label,
  accept,
  value,
  onChange,
  onError,
  maxSizeMB = 5,
  className = '',
  onUploadFile,
}: FileUploadProps) {

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      onError?.(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }

    setIsUploading(true);
    try {
      let finalUrl: string;

      if (onUploadFile) {
        // Delegate upload to parent (e.g. Supabase Storage)
        finalUrl = await onUploadFile(file);
      } else {
        // Fallback: local preview URL only (not persisted)
        finalUrl = URL.createObjectURL(file);
      }

      onChange(finalUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Failed to upload file. Please try again.';
      onError?.(message);
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  const hasFile = Boolean(value);

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative group">
            {accept.startsWith('image/') ? (
              <img 
                src={value} 
                alt="Preview" 
                className="h-24 w-24 object-cover rounded-lg"
              />
            ) : (
              <div className="h-24 w-24 flex items-center justify-center bg-gray-100 rounded-lg">
                <FiVideo className="text-gray-400 text-2xl" />
              </div>
            )}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remove"
            >
              <FiX size={16} />
            </button>
          </div>
        ) : (
          <div className="h-24 w-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400">
            {accept.startsWith('image/') ? (
              <FiImage size={24} />
            ) : (
              <FiVideo size={24} />
            )}
          </div>
        )}

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
            disabled={isUploading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : hasFile ? 'Replace file' : 'Choose file'}
          </button>
          <p className="mt-1 text-xs text-gray-500">
            {accept.startsWith('image/') ? 'PNG, JPG, or SVG' : 'MP4 or WebM'}{' '}
            (max {maxSizeMB}MB)
          </p>
          {hasFile && !isUploading && (
            <p className="mt-1 text-xs font-medium text-emerald-600">
              Upload complete
            </p>
          )}
        </div>
      </div>
    </div>
  );
}