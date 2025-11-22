import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCompanyBySlug } from '../services/companyService';
import { getJobsByCompanyId } from '../services/jobService';
import { getContentSectionsByCompanyId } from '../services/contentSectionService';
import { getFaqsByCompanyId } from '../services/faqService';
import type { Company, Job, ContentSection, FAQ } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { FiMapPin, FiBriefcase, FiSearch } from 'react-icons/fi';
import { PreviewBanner } from '../components/recruiter/PreviewBanner';
import { JobDetailModal } from '../components/candidate/JobDetailModal';

export function CareersPage() {
  const { companySlug } = useParams();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    if (!companySlug) return;

    const fetchData = async () => {
      setIsLoading(true);
      
      const companyResult = await getCompanyBySlug(companySlug);
      if (companyResult.error) {
        setError(companyResult.error);
        setIsLoading(false);
        return;
      }
      
      const companyData = companyResult.data;
      setCompany(companyData);

      if (companyData) {
        const [jobsResult, sectionsResult, faqsResult] = await Promise.all([
          getJobsByCompanyId(companyData.id),
          getContentSectionsByCompanyId(companyData.id),
          getFaqsByCompanyId(companyData.id),
        ]);

        if (jobsResult.error) {
          setError(jobsResult.error);
        } else {
          setJobs((jobsResult.data || []).filter((job) => job.status === 'open'));
        }

        if (!sectionsResult.error) {
          setSections((sectionsResult.data || []).filter((s) => s.is_visible));
        }

        if (!faqsResult.error) {
          setFaqs(faqsResult.data || []);
        }
      }

      setIsLoading(false);
    };

    fetchData();
  }, [companySlug]);

  useEffect(() => {
    if (!company) return;

    const previousTitle = document.title;
    const metaTag = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    const previousDescription = metaTag?.content ?? '';

    const jobCount = jobs.length;
    const pageTitle = `${company.name} – Careers at ${company.name} | CareerHub`;
    const descriptionBase = company.mission_statement || `${company.name} careers at a glance.`;
    const descriptionSuffix = jobCount
      ? ` ${jobCount} open position${jobCount === 1 ? '' : 's'} available.`
      : '';

    document.title = pageTitle;

    let descriptionMeta = metaTag;
    if (!descriptionMeta) {
      descriptionMeta = document.createElement('meta');
      descriptionMeta.name = 'description';
      document.head.appendChild(descriptionMeta);
    }
    descriptionMeta.content = `${descriptionBase}${descriptionSuffix}`;

    return () => {
      document.title = previousTitle;
      if (descriptionMeta) {
        descriptionMeta.content = previousDescription;
      }
    };
  }, [company, jobs.length]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Company Not Found</h2>
          <p className="text-gray-600">The careers page you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const primaryColor = company.primary_color || '#1D4ED8';
  const secondaryColor = company.secondary_color || '#6366F1';

  const hasYoutubeCultureVideo = Boolean(company.culture_video_youtube_url);
  const hasUploadedCultureVideo = Boolean(company.culture_video_upload_path);

  const locations = Array.from(
    new Set(
      jobs
        .map((job) => job.location)
        .filter((value): value is string => Boolean(value))
    )
  );

  const filteredJobs = jobs.filter((job) => {
    const matchesLocation = locationFilter ? job.location === locationFilter : true;
    const matchesType = typeFilter ? job.job_type === typeFilter : true;
    const matchesLevel = levelFilter ? job.experience_level === levelFilter : true;
    const matchesSearch = searchTerm
      ? job.title.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return matchesLocation && matchesType && matchesLevel && matchesSearch;
  });

  const firstJob = filteredJobs[0] || jobs[0];

  const structuredData: unknown[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: company.name,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      logo: company.logo_storage_path || undefined,
      description: company.mission_statement || undefined,
    },
  ];

  if (firstJob) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: firstJob.title,
      description: firstJob.description,
      datePosted: firstJob.created_at,
      employmentType: firstJob.job_type,
      hiringOrganization: {
        '@type': 'Organization',
        name: company.name,
      },
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
    });
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50">
      {isPreview && <PreviewBanner />}
      {/* Company Header / Hero */}
      <div className="border-b border-gray-200">
        <div
          className="relative"
          style={
            company.banner_storage_path
              ? {
                  backgroundImage: `linear-gradient(to bottom, rgba(15,23,42,0.65), rgba(15,23,42,0.9)), url(${company.banner_storage_path})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : {
                  backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
                }
          }
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-16 flex flex-col md:flex-row gap-8 items-center md:items-end">
            {company.logo_storage_path && (
              <div className="shrink-0">
                <img
                  src={company.logo_storage_path}
                  alt={company.name}
                  className="w-24 h-24 rounded-2xl object-cover bg-white/90 p-2 shadow-lg border border-white/60"
                />
              </div>
            )}

            <div className="flex-1 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-sm">{company.name}</h1>
              {company.mission_statement && (
                <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                  {company.mission_statement}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Culture Video */}
      {(hasYoutubeCultureVideo || hasUploadedCultureVideo) && (
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-10">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Life at {company.name}</h2>
            <p className="text-sm text-gray-600 mb-4">
              Get a quick glimpse of the culture, people, and work environment before you apply.
            </p>
            <div className="aspect-video rounded-xl overflow-hidden bg-black">
              {hasUploadedCultureVideo ? (
                <video
                  src={company.culture_video_upload_path as string}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : hasYoutubeCultureVideo ? (
                <iframe
                  src={company.culture_video_youtube_url as string}
                  title={`${company.name} culture video`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Content Sections */}
      {sections.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-10 space-y-10">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm"
              style={{
                borderTop:
                  section.type && primaryColor
                    ? `4px solid ${primaryColor}`
                    : undefined,
              }}
            >
              {section.title && (
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{section.title}</h2>
              )}
              {section.content && (
                <p className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">{section.content}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Jobs Section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Open Positions ({filteredJobs.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="md:col-span-2">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by job title..."
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All levels</option>
            <option value="entry">Entry</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
          </select>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <p className="text-xl text-gray-600">No open positions at the moment.</p>
            <p className="text-gray-500 mt-2">Check back soon for new opportunities!</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <p className="text-xl text-gray-600">No positions match your filters.</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters to see more roles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-500 hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedJob(job)}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                
                {/* ✅ REMOVED: department field (doesn't exist) */}
                
                <div className="space-y-2 mb-4">
                  {/* ✅ REMOVED: is_remote field */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiMapPin size={16} />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiBriefcase size={16} />
                    {/* ✅ FIXED: Use job_type and experience_level */}
                    <span>{job.job_type} • {job.experience_level}</span>
                  </div>
                  {job.salary_range_string && (
                    <div className="text-sm font-medium text-emerald-600">
                      {job.salary_range_string}
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {job.description}
                </p>

                <button
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedJob(job);
                  }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAQs */}
      {faqs.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pb-16">
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <details
                  key={faq.id}
                  className="group border border-gray-200 rounded-xl p-4 hover:border-blue-400 transition"
                >
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                    <span className="text-sm font-semibold text-gray-900">{faq.question}</span>
                    <span className="text-xs text-blue-600 group-open:hidden">Show</span>
                    <span className="text-xs text-blue-600 hidden group-open:inline">Hide</span>
                  </summary>
                  <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      )}

      <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />

      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  );
}
