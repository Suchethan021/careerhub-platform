import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiMail, FiLock, FiEye, FiEyeOff, FiBriefcase } from 'react-icons/fi';
import { motion } from 'framer-motion';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const err = await login(email, password);
    if (err) {
      setError(err);
      setIsLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left - Brand Side */}
      <div className="hidden lg:flex bg-linear-to-br from-blue-600 via-purple-600 to-pink-500 p-12 flex-col justify-between relative overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 text-white">
            <FiBriefcase size={32} />
            <span className="text-2xl font-bold">CareerHub</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10"
        >
          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
            Build Your Dream<br />Careers Page
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join 500+ companies creating beautiful, branded career experiences that attract top talent.
          </p>

          {/* Testimonial */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <p className="text-white/90 mb-4 italic">
              "CareerHub transformed how we showcase our company. We saw a 3x increase in quality applications!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                SK
              </div>
              <div>
                <p className="text-white font-semibold">Sarah Kim</p>
                <p className="text-white/70 text-sm">Head of Talent, TechCorp</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="relative z-10 flex gap-8 text-white/80 text-sm">
          <span>© 2025 CareerHub</span>
          <span>•</span>
          <Link to="/privacy" className="hover:text-white transition">Privacy</Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-white transition">Terms</Link>
        </div>
      </div>

      {/* Right - Form Side */}
      <div className="flex items-center justify-center p-8 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Recruiter sign in</h1>
              <p className="text-gray-600 mb-1">Use your recruiter account to manage jobs and your careers page.</p>
              <p className="text-xs text-gray-500">
                Candidates don&apos;t need an account to browse jobs. Candidate login and saved jobs are coming soon.
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-blue-600 font-semibold hover:text-blue-700 transition"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>

          {/* Mobile logo */}
          <div className="lg:hidden mt-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-600">
              <FiBriefcase size={24} />
              <span className="text-xl font-bold">CareerHub</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
