import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBriefcase, FiSettings, FiEdit3, FiEye, FiPlus, FiLogOut } from 'react-icons/fi';

export function Dashboard() {
  const { user, logout } = useAuth();

  const dashboardItems = [
    { title: 'Create Job', desc: 'Post a new job opening', icon: FiPlus, color: 'from-blue-400 to-blue-600', path: '#' },
    { title: 'Manage Jobs', desc: 'View and edit all postings', icon: FiBriefcase, color: 'from-green-400 to-green-600', path: '#' },
    { title: 'Company Profile', desc: 'Update company details', icon: FiEdit3, color: 'from-purple-400 to-purple-600', path: '#' },
    { title: 'Preview', desc: 'See your careers page', icon: FiEye, color: 'from-pink-400 to-pink-600', path: '#' },
    { title: 'Settings', desc: 'Configure preferences', icon: FiSettings, color: 'from-yellow-400 to-yellow-600', path: '#' },
  ];

  const handleLogout = async () => {
    await logout();
  };

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                  className={`block p-6 rounded-xl bg-linear-to-br ${item.color} text-white shadow-lg hover:shadow-xl hover:scale-105 transition group`}
                >
                  <Icon className="text-4xl mb-4 group-hover:scale-110 transition" />
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm opacity-90">{item.desc}</p>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
