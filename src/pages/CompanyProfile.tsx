import { useCompany } from '../hooks/useCompany';
import { useNavigate } from 'react-router-dom';
import { CompanyForm } from '../components/recruiter/CompanyForm';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import type { Company } from '../types';
import { ContentFaqManager } from '../components/recruiter/ContentFaqManager';

export function CompanyProfile() {
  const { company, isLoading, create, update } = useCompany();
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleSave = async (data: Partial<Company>) => {
    try {
      if (company) {
        const { error } = await update(company.id, data);
        if (error) {
          throw new Error(error);
        }
      } else {
        // ✅ Ensure required fields are present for creation
        const companyData: Omit<Company, 'id' | 'created_at' | 'updated_at'> = {
          name: data.name || '',
          slug: data.slug || '',
          recruiter_id: '', // Will be set by useCompany hook
          logo_storage_path: data.logo_storage_path || null,
          banner_storage_path: data.banner_storage_path || null,
          primary_color: data.primary_color,
          secondary_color: data.secondary_color,
          accent_color: data.accent_color,
          font_family: data.font_family,
          mission_statement: data.mission_statement || null,
          culture_video_youtube_url: data.culture_video_youtube_url || null,
          culture_video_upload_path: data.culture_video_upload_path || null,
          culture_video_type: data.culture_video_type || null,
          is_published: data.is_published ?? false,
          created_by: null,
          updated_by: null,
        };
        
        const { error } = await create(companyData);
        if (error) {
          throw new Error(error);
        }
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving company:', error);
    }
  };


  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
        {/* Back Button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <FiArrowLeft /> Back to Dashboard
        </Link>

        {/* Form */}
        <CompanyForm
          company={company}
          onSave={handleSave}
          onCancel={() => navigate('/dashboard')}
        />

        {/* Content & FAQs Manager */}
        {company && <ContentFaqManager companyId={company.id} />}
      </div>
    </div>
  );
}
