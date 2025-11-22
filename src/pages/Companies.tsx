import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBriefcase } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { getPublishedCompanies } from '../services/companyService';
import { getJobsByCompanyId } from '../services/jobService';
import type { Company } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

interface CompanyWithJobs extends Company {
  jobCount: number;
}

export function Companies() {
  const [companies, setCompanies] = useState<CompanyWithJobs[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadCompanies() {
      const result = await getPublishedCompanies();
      
      if (result.data) {
        // Get job counts for each company
        const companiesWithJobs = await Promise.all(
          result.data.map(async (company) => {
            const jobsResult = await getJobsByCompanyId(company.id);
            const openJobs = (jobsResult.data || []).filter(job => job.status === 'open');
            return { ...company, jobCount: openJobs.length };
          })
        );
        
        setCompanies(companiesWithJobs);
      }
      
      setIsLoading(false);
    }

    loadCompanies();
  }, []);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredCompanies = companies.filter((company) => {
    if (!normalizedSearch) return true;
    const inName = company.name.toLowerCase().includes(normalizedSearch);
    const inMission = (company.mission_statement || '').toLowerCase().includes(normalizedSearch);
    return inName || inMission;
  });

  const highlight = (text: string) => {
    if (!normalizedSearch) return text;
    const lower = text.toLowerCase();
    const index = lower.indexOf(normalizedSearch);
    if (index === -1) return text;
    const before = text.slice(0, index);
    const match = text.slice(index, index + normalizedSearch.length);
    const after = text.slice(index + normalizedSearch.length);
    return (
      <>
        {before}
        <span className="bg-yellow-200 text-gray-900 rounded px-0.5">{match}</span>
        {after}
      </>
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading companies and open roles..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <h1 className="text-5xl font-bold mb-4">Explore Companies</h1>
          <p className="text-xl text-white/90 mb-8">
            Discover {companies.length} amazing companies hiring right now
          </p>

          {/* Search */}
          <div className="max-w-2xl">
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 rounded-lg text-gray-900 text-lg focus:ring-4 focus:ring-white/20 transition cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
        {filteredCompanies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {searchTerm ? 'No companies found matching your search.' : 'No companies available yet.'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/${company.slug}/careers`}
                  className="block bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden group cursor-pointer"
                >
                  {/* Company Banner/Logo Area */}
                  <div 
                    className="h-32 bg-linear-to-br"
                    style={{
                      background: company.primary_color 
                        ? `linear-gradient(to bottom right, ${company.primary_color}, ${company.secondary_color || company.primary_color})`
                        : 'linear-gradient(to bottom right, #0066CC, #FF6B6B)'
                    }}
                  />

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                      {highlight(company.name)}
                    </h3>
                    
                    {company.mission_statement && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {highlight(company.mission_statement)}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiBriefcase size={16} />
                        <span>{company.jobCount} open {company.jobCount === 1 ? 'position' : 'positions'}</span>
                      </div>
                      
                      <span className="text-blue-600 font-medium group-hover:underline">
                        View Jobs →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
