import { useState } from 'react';
import type { Job } from '../../types';
import { FiSave, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface JobFormProps {
  job?: Job | null;
  companyId: string;
  onSave: (data: Partial<Job>) => Promise<void>;
  onCancel: () => void;
}

export function JobForm({ job, companyId, onSave, onCancel }: JobFormProps) {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    description: job?.description || '',
    location: job?.location || '',
    job_type: job?.job_type || 'full-time',
    salary_min: job?.salary_min?.toString() || '',
    salary_max: job?.salary_max?.toString() || '',
    salary_currency: job?.salary_currency || 'USD',
    salary_period: job?.salary_period || 'monthly',
    experience_level: job?.experience_level || 'mid',
    status: job?.status !== undefined ? job.status : 'open',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const salaryMin = formData.salary_min ? parseFloat(formData.salary_min) : null;
    const salaryMax = formData.salary_max ? parseFloat(formData.salary_max) : null;

    if (salaryMin !== null && salaryMax !== null && salaryMin > salaryMax) {
      setError('Salary max must be greater than or equal to salary min.');
      setIsSubmitting(false);
      return;
    }

    const salary_range_string =
      salaryMin !== null &&
      salaryMax !== null &&
      formData.salary_currency &&
      formData.salary_period
        ? `${formData.salary_currency} ${salaryMin.toLocaleString()}–${salaryMax.toLocaleString()} / ${
            formData.salary_period === 'monthly' ? 'month' : 'year'
          }`
        : undefined;

    try {
      await onSave({
        ...formData,
        company_id: companyId,
        salary_min: salaryMin,
        salary_max: salaryMax,
        salary_range_string,
      });
    } catch (err) {
      const message = (err as Error).message;
      if (message.includes('salary_range_valid')) {
        setError('Salary range is invalid. Salary max must be greater than or equal to salary min.');
      } else {
        setError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {job ? 'Edit Job' : 'Create New Job'}
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Senior Software Engineer"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe the role, responsibilities, and requirements..."
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="San Francisco, CA"
          />
        </div>

        {/* Job Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Type *
          </label>
          <select
            name="job_type"
            value={formData.job_type}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience Level *
          </label>
          <select
            name="experience_level"
            value={formData.experience_level}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="entry">Entry-level</option>
            <option value="mid">Mid-level</option>
            <option value="senior">Senior</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Salary Min */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salary Min
          </label>
          <input
            type="number"
            name="salary_min"
            value={formData.salary_min}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="80000"
          />
        </div>

        {/* Salary Max */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salary Max
          </label>
          <input
            type="number"
            name="salary_max"
            value={formData.salary_max}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="120000"
          />
        </div>

        {/* Currency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            name="salary_currency"
            value={formData.salary_currency}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="INR">INR</option>
            <option value="AED">AED</option>
            <option value="SAR">SAR</option>
          </select>
        </div>

        {/* Salary Period */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salary Period
          </label>
          <select
            name="salary_period"
            value={formData.salary_period}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition"
        >
          <FiSave /> {isSubmitting ? 'Saving...' : 'Save Job'}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
        >
          <FiX /> Cancel
        </button>
      </div>
    </motion.form>
  );
}
