import { FiBriefcase, FiEye, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface DashboardStatsProps {
  jobCount: number;
  companyName?: string;
}

export function DashboardStats({ jobCount, companyName }: DashboardStatsProps) {
  const stats = [
    { 
      label: 'Active Jobs', 
      value: jobCount, 
      icon: FiBriefcase, 
      color: 'from-blue-400 to-blue-600',
      change: '+2 this week' 
    },
    { 
      label: 'Page Views', 
      value: '1.2K', 
      icon: FiEye, 
      color: 'from-green-400 to-green-600',
      change: '+15% this month' 
    },
    { 
      label: 'Applications', 
      value: '45', 
      icon: FiUsers, 
      color: 'from-purple-400 to-purple-600',
      change: '+8 this week' 
    },
    { 
      label: 'Conversion Rate', 
      value: '3.7%', 
      icon: FiTrendingUp, 
      color: 'from-orange-400 to-orange-600',
      change: '+0.5% improvement' 
    },
  ];

  return (
    <div className="mb-8">
      {companyName && (
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Welcome to {companyName}! 👋
        </h2>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-500 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-linear-to-br ${stat.color}`}>
                  <Icon className="text-xl text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.change}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
