import { useState } from 'react';
import { useCompany } from '../hooks/useCompany';
import { useJobs } from '../hooks/useJobs';
import { JobList } from '../components/recruiter/JobList';
import { JobForm } from '../components/recruiter/JobForm';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import type { Job } from '../types';

export function JobManager() {
  const { company, isLoading: companyLoading } = useCompany();
  const { jobs, isLoading: jobsLoading, create, update, remove } = useJobs(company?.id);
  const location = useLocation();
  const isNewRoute = location.pathname.endsWith('/jobs/new');
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isCreating, setIsCreating] = useState(isNewRoute);

  if (companyLoading || jobsLoading) {
    return <LoadingSpinner />;
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Company Profile First</h2>
          <p className="text-gray-600 mb-6">You need to create a company profile before adding jobs.</p>
          <Link
            to="/company-profile"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
          >
            Create Company Profile
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = async (data: Partial<Job>) => {
    try {
      if (editingJob) {
        await update(editingJob.id, data);
        setEditingJob(null);
      } else {
        // ✅ Ensure required fields are present for creation
        const jobData: Omit<Job, 'id' | 'created_at' | 'updated_at'> = {
          company_id: company!.id,
          title: data.title || '',
          description: data.description || '',
          location: data.location || null,
          job_type: data.job_type || 'full-time',
          salary_min: data.salary_min || null,
          salary_max: data.salary_max || null,
          salary_currency: data.salary_currency || null,
          salary_period: data.salary_period || null,
          salary_range_string: data.salary_range_string || null,
          experience_level: data.experience_level || 'mid',
          status: data.status || 'open',
          created_by: null,
          updated_by: null,
          deleted_at: null,
          is_featured: false,
        };
        
        await create(jobData);
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };


  const handleCancel = () => {
    setEditingJob(null);
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
        {/* Back Button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <FiArrowLeft /> Back to Dashboard
        </Link>

        {/* Show Form or List */}
        {(isCreating || editingJob) ? (
          <JobForm
            job={editingJob}
            companyId={company.id}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <JobList
            jobs={jobs}
            onEdit={setEditingJob}
            onDelete={remove}
            onCreateNew={() => setIsCreating(true)}
          />
        )}
      </div>
    </div>
  );
}
