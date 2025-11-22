import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiMapPin, FiBriefcase, FiChevronRight } from 'react-icons/fi';
import { getJobs } from '../services/jobService';
import { getPublishedCompanies } from '../services/companyService';
import type { Job, Company } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ComingSoonModal } from '../components/common/ComingSoonModal';

interface JobWithCompany extends Job {
  company?: Company;
}

export function PublicJobs() {
  const [jobs, setJobs] = useState<JobWithCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      const [jobsResult, companiesResult] = await Promise.all([
        getJobs(),
        getPublishedCompanies(),
      ]);

      if (jobsResult.error) {
        setError(jobsResult.error);
        setIsLoading(false);
        return;
      }

      if (companiesResult.error) {
        setError(companiesResult.error);
        setIsLoading(false);
        return;
      }

      const companiesById = new Map(
        (companiesResult.data || []).map((company) => [company.id, company])
      );

      const openJobs: JobWithCompany[] = (jobsResult.data || [])
        .filter((job) => job.status === 'open')
        .map((job) => ({
          ...job,
          company: companiesById.get(job.company_id),
        }))
        .filter((job) => job.company);

      setJobs(openJobs);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const previousTitle = document.title;
    const metaTag = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    const previousDescription = metaTag?.content ?? '';

    const count = jobs.length;
    const pageTitle = count
      ? `Browse ${count} open roles | CareerHub`
      : 'Browse open roles | CareerHub';

    document.title = pageTitle;

    let descriptionMeta = metaTag;
    if (!descriptionMeta) {
      descriptionMeta = document.createElement('meta');
      descriptionMeta.name = 'description';
      document.head.appendChild(descriptionMeta);
    }

    descriptionMeta.content = count
      ? `Discover ${count} open roles across top companies on CareerHub. Filter by location, job type, and level.`
      : 'Discover open roles across top companies on CareerHub. Filter by location, job type, and level.';

    return () => {
      document.title = previousTitle;
      if (descriptionMeta) {
        descriptionMeta.content = previousDescription;
      }
    };
  }, [jobs.length]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Unable to load jobs</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Please try again in a moment. If the issue persists, contact the recruiter or refresh the page.
          </p>
        </div>
      </div>
    );
  }

  const locations = Array.from(
    new Set(
      jobs
        .map((job) => job.location)
        .filter((value): value is string => Boolean(value))
    )
  );

  const filteredJobs = jobs.filter((job) => {
    const companyName = job.company?.name || '';
    const matchesSearch = searchTerm
      ? job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        companyName.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesLocation = locationFilter ? job.location === locationFilter : true;
    const matchesType = typeFilter ? job.job_type === typeFilter : true;
    const matchesLevel = levelFilter ? job.experience_level === levelFilter : true;

    return matchesSearch && matchesLocation && matchesType && matchesLevel;
  });

  const firstJob = filteredJobs[0] || jobs[0];

  const structuredData = firstJob
    ? [
        {
          '@context': 'https://schema.org',
          '@type': 'JobPosting',
          title: firstJob.title,
          description: firstJob.description,
          datePosted: firstJob.created_at,
          employmentType: firstJob.job_type,
          hiringOrganization: firstJob.company
            ? {
                '@type': 'Organization',
                name: firstJob.company.name,
              }
            : undefined,
          jobLocation: firstJob.location
            ? {
                '@type': 'Place',
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: firstJob.location,
                },
              }
            : undefined,
          jobLocationType: firstJob.location || undefined,
          baseSalary:
            firstJob.salary_min && firstJob.salary_max && firstJob.salary_currency
              ? {
                  '@type': 'MonetaryAmount',
                  currency: firstJob.salary_currency,
                  value: {
                    '@type': 'QuantitativeValue',
                    minValue: firstJob.salary_min,
                    maxValue: firstJob.salary_max,
                    unitText: firstJob.salary_period === 'monthly' ? 'MONTH' : 'YEAR',
                  },
                }
              : undefined,
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Browse open roles</h1>
          <p className="text-lg text-white/90 mb-6 max-w-2xl">
            Explore open positions across published companies on CareerHub. Use filters to find a role that fits you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-white/10 backdrop-blur rounded-2xl p-4">
            <div className="md:col-span-2">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by job title or company..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">All locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">All types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">All levels</option>
              <option value="entry">Entry</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-gray-300">
            <p className="text-xl text-gray-700 mb-2">No roles match your filters.</p>
            <p className="text-gray-500">Try clearing some filters or searching for a different keyword.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-500 hover:shadow-lg transition flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {job.company && (
                      <Link
                        to={`/careers/${job.company.slug}`}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline truncate"
                      >
                        {job.company.name}
                      </Link>
                    )}
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 truncate">
                    {job.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                    <span className="inline-flex items-center gap-1">
                      <FiMapPin size={14} />
                      <span>{job.location || 'Location not specified'}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <FiBriefcase size={14} />
                      <span>
                        {job.job_type}
                        <span className="mx-1">•</span>
                        {job.experience_level}
                      </span>
                    </span>
                  </div>

                  {job.salary_range_string && (
                    <p className="text-sm text-green-700 bg-green-50 inline-flex px-3 py-1 rounded-full font-medium mb-2">
                      {job.salary_range_string}
                    </p>
                  )}

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {job.description}
                  </p>
                </div>

                <div className="flex flex-col items-stretch gap-2 w-full md:w-40">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                  >
                    Apply
                    <FiChevronRight size={16} />
                  </button>

                  {job.company && (
                    <Link
                      to={`/${job.company.slug}/careers`}
                      className="w-full inline-flex items-center justify-center gap-1 px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      View careers page
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <ComingSoonModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        featureName="Apply to jobs"
        description="In this prototype, job applications are coming soon. For now, use the company careers pages to learn more about each role."
      />

      {structuredData.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </div>
  );
}
