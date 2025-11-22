import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUser } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

export function Profile() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <FiArrowLeft /> Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex items-start gap-6"
        >
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
            <FiUser className="text-blue-600" size={28} />
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Profile</h1>
              <p className="text-sm text-gray-500">
                Basic account details. A more advanced recruiter profile (notifications, roles, etc.) would live here in a future version.
              </p>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</p>
                <p className="text-sm text-gray-900">{user?.email}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">User ID</p>
                <p className="text-xs font-mono text-gray-600 break-all">{user?.id}</p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-800">
              This prototype keeps the profile simple. In a real ATS, this page would manage notification settings,
              connected ATS accounts, and team permissions.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
