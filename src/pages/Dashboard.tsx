import { useAuth } from '../hooks/useAuth';
import { useCompany } from '../hooks/useCompany';
import { useJobs } from '../hooks/useJobs';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBriefcase, FiEdit3, FiEye, FiPlus, FiLogOut, FiUser } from 'react-icons/fi';
import { DashboardStats } from '../components/recruiter/DashboardStats';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { WebShareButton } from '../components/common/WebShareButton';

export function Dashboard() {
  const { user, logout } = useAuth();
  const { company, isLoading: companyLoading } = useCompany();
  const { jobs, isLoading: jobsLoading } = useJobs(company?.id);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (companyLoading || jobsLoading) {
    return <LoadingSpinner />;
  }

  // If no company profile, redirect to create one
  if (!company) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl text-center"
        >
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiBriefcase className="text-4xl text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to CareerHub!</h2>
          <p className="text-gray-600 mb-8">
            Let's start by creating your company profile. This will be visible to candidates on your careers page.
          </p>
          <Link
            to="/company-profile"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
          >
            <FiPlus /> Create Company Profile
          </Link>
        </motion.div>
      </div>
    );
  }

  const dashboardItems = [
    { 
      title: 'Create Job', 
      desc: 'Post a new job opening', 
      icon: FiPlus, 
      color: 'from-blue-400 to-blue-600', 
      path: '/jobs/new' 
    },
    { 
      title: 'Manage Jobs', 
      desc: 'View and edit all postings', 
      icon: FiBriefcase, 
      color: 'from-green-400 to-green-600', 
      path: '/jobs' 
    },
    { 
      title: 'Company Profile', 
      desc: 'Update company details', 
      icon: FiEdit3, 
      color: 'from-purple-400 to-purple-600', 
      path: '/company-profile' 
    },
    { 
      title: 'Preview Careers Page', 
      desc: 'See your public page', 
      icon: FiEye, 
      color: 'from-pink-400 to-pink-600', 
      path: `/careers/${company.slug}?preview=true` 
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">{user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              <FiUser /> Profile
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
        {/* Stats */}
        <DashboardStats jobCount={jobs.length} companyName={company.name} />

        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Public careers page</p>
            <p className="text-sm text-gray-600 break-all">{`${window.location.origin}/${company.slug}/careers`}</p>
            <p className="text-xs text-gray-500 mt-1">
              {company.is_published
                ? 'Your page is published and visible to candidates.'
                : 'Your page is not published yet. Enable "Publish Company Page" in your company profile to make it public.'}
            </p>
          </div>
          <WebShareButton
            title="Check out our careers page"
            text={`Check out open positions at ${company.name}`}
            url={`${window.location.origin}/${company.slug}/careers`}
            className="mt-2"
          >
            Share Careers Page
          </WebShareButton>
        </div>

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {dashboardItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div key={idx} variants={itemVariants}>
                <Link
                  to={item.path}
                  className={`block p-6 rounded-xl bg-linear-to-br ${item.color} text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all group`}
                >
                  <Icon className="text-4xl mb-4 group-hover:scale-110 transition" />
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm opacity-90">{item.desc}</p>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Recent Jobs */}
        {jobs.length > 0 && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Jobs</h2>
              <Link
                to="/jobs"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-500 hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{job.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{job.location}</span>
                    <span>{job.job_type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
