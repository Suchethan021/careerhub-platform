import { useLocation, Link } from 'react-router-dom';
import { FiMail, FiArrowRight, FiBriefcase } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export function EmailConfirmation() {
  const location = useLocation();
  const email = location.state?.email || 'your email';
  const [resent, setResent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;
      
      setResent(true);
      setCooldown(60); // Start 60 second cooldown
      
      // Clear success message after 3 seconds
      setTimeout(() => setResent(false), 3000);
    } catch (error) {
      console.error('Error resending email:', error);
      alert('Failed to resend email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FiMail className="w-10 h-10 text-white" />
          </motion.div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Check your email</h1>
          <p className="text-gray-600 mb-2">
            We sent a confirmation link to
          </p>
          <p className="text-lg font-semibold text-gray-900 mb-6">{email}</p>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-blue-900 mb-3 font-medium">
              📧 What to do next:
            </p>
            <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
              <li>Open your email inbox</li>
              <li>Find the email from CareerHub</li>
              <li>Click the confirmation link</li>
              <li>You'll be redirected to your dashboard</li>
            </ol>
          </div>

          {/* Success message */}
          {resent && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm font-medium"
            >
              ✓ Email sent successfully!
            </motion.div>
          )}

          {/* Resend button with timer */}
          <button
            onClick={handleResend}
            disabled={cooldown > 0 || isResending}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline transition disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline cursor-pointer"
          >
            {isResending ? (
              'Sending...'
            ) : cooldown > 0 ? (
              `Resend available in ${cooldown}s`
            ) : (
              "Didn't receive the email? Resend"
            )}
          </button>

          {/* Divider */}
          <div className="my-6 border-t border-gray-200" />

          {/* Bottom links */}
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Already confirmed?{' '}
              <Link to="/login" className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer">
                Sign in <FiArrowRight size={14} />
              </Link>
            </p>
            <p className="text-xs text-gray-500">
              Check your spam folder if you don't see the email
            </p>
          </div>
        </div>

        {/* Logo */}
        <div className="mt-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition cursor-pointer">
            <FiBriefcase size={20} />
            <span className="font-semibold">Back to CareerHub</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
