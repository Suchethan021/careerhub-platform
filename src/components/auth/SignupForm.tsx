import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiMail, FiLock, FiEye, FiEyeOff, FiBriefcase, FiCheck, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  // Password strength
  const passwordStrength = {
    hasMinLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };

  const isPasswordStrong = Object.values(passwordStrength).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!isPasswordStrong) {
      setError('Please meet all password requirements');
      return;
    }

    setIsLoading(true);
    const err = await signup(email, password);
    
    if (err) {
      setError(err);
      setIsLoading(false);
    } else {
      // Navigate to email confirmation page
      navigate('/email-confirmation', { state: { email } });
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left - Brand Side */}
      <div className="hidden lg:flex bg-linear-to-br from-purple-600 via-pink-500 to-red-500 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
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
            Start Your Journey<br />Today
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Create your branded careers page in minutes. No credit card required.
          </p>

          {/* Features */}
          <div className="space-y-4">
            {['Custom branding', 'Unlimited jobs', 'Mobile optimized', 'Analytics included'].map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 text-white/90"
              >
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <FiCheck size={14} />
                </div>
                <span>{feature}</span>
              </motion.div>
            ))}
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
              <p className="text-gray-600">Get started for free in seconds</p>
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
                  Work email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
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
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
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

                {/* Password strength indicators */}
                {password && (
                  <div className="mt-3 space-y-2">
                    <PasswordRequirement
                      met={passwordStrength.hasMinLength}
                      text="At least 8 characters"
                    />
                    <PasswordRequirement
                      met={passwordStrength.hasUpperCase}
                      text="One uppercase letter"
                    />
                    <PasswordRequirement
                      met={passwordStrength.hasLowerCase}
                      text="One lowercase letter"
                    />
                    <PasswordRequirement
                      met={passwordStrength.hasNumber}
                      text="One number"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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

              <button
                type="submit"
                disabled={isLoading || !isPasswordStrong}
                className="w-full py-3 px-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create account'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-purple-600 font-semibold hover:text-purple-700 transition"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <p className="mt-6 text-xs text-center text-gray-500">
              By signing up, you agree to our{' '}
              <Link to="/terms" className="text-purple-600 hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-purple-600 hover:underline">Privacy Policy</Link>
            </p>
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

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 text-sm ${met ? 'text-green-600' : 'text-gray-400'}`}>
      {met ? (
        <FiCheck className="shrink-0" size={16} />
      ) : (
        <FiX className="shrink-0" size={16} />
      )}
      <span>{text}</span>
    </div>
  );
}
