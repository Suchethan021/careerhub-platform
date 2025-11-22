import type { Job } from '../../types';
import { FiMapPin, FiBriefcase, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface JobDetailModalProps {
  job: Job | null;
  onClose: () => void;
}

export function JobDetailModal({ job, onClose }: JobDetailModalProps) {
  const isOpen = Boolean(job);

  return (
    <AnimatePresence>
      {isOpen && job && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-6 sm:p-8 relative"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition"
            >
              <FiX size={18} />
            </button>

            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-2">
                    <FiMapPin size={16} />
                    <span>{job.location || 'Location not specified'}</span>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <FiBriefcase size={16} />
                    <span>
                      {job.job_type}
                      <span className="mx-1">•</span>
                      {job.experience_level}
                    </span>
                  </span>
                </div>
              </div>

              {job.salary_range_string && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                  {job.salary_range_string}
                </div>
              )}

              <div className="h-px bg-gray-200" />

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1 text-sm text-gray-700 leading-relaxed">
                {job.description}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

