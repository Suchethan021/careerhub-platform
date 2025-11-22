import type { Job } from '../../types';
import { FiEdit2, FiTrash2, FiMapPin, FiBriefcase, FiDollarSign, FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

export function JobCard({ job, onEdit, onDelete }: JobCardProps) {
  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) return 'Salary not specified';
    
    const format = (num: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: job.salary_currency || 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(num);
    };

    const period = job.salary_period ? ` / ${job.salary_period}` : '';

    if (job.salary_min && job.salary_max) {
      return `${format(job.salary_min)} - ${format(job.salary_max)}${period}`;
    }
    
    return job.salary_min ? `From ${format(job.salary_min)}${period}` : `Up to ${format(job.salary_max!)}${period}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-500 hover:shadow-lg transition"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
            {job.status === 'open' ? (
              <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                <FiEye size={12} /> Open
              </span>
            ) : job.status === 'draft' ? (
              <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                <FiEyeOff size={12} /> Draft
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                <FiEyeOff size={12} /> Closed
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(job)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            title="Edit job"
          >
            <FiEdit2 size={18} />
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this job?')) {
                onDelete(job.id);
              }
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Delete job"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiMapPin size={16} />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiBriefcase size={16} />
          <span>{job.job_type} • {job.experience_level}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiDollarSign size={16} />
          <span>{formatSalary()}</span>
        </div>
      </div>

      {/* Description Preview */}
      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
        {job.description}
      </p>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
        <span>Created {new Date(job.created_at).toLocaleDateString()}</span>
        <span>Updated {new Date(job.updated_at).toLocaleDateString()}</span>
      </div>
    </motion.div>
  );
}

