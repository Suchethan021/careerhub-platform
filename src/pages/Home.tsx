import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiBriefcase, FiUsers, FiEye, FiTrendingUp, FiCheck, FiZap, FiShield } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { ComingSoonModal } from '../components/common/ComingSoonModal';

export function Home() {
  const { isAuthenticated } = useAuth();
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  const features = [
    { 
      icon: FiBriefcase, 
      title: 'Job Management', 
      desc: 'Create, edit, and manage job postings with ease. Organize by department, seniority level, and location.',
      badge: '⭐ Core Feature'
    },
    { 
      icon: FiUsers, 
      title: 'Talent Discovery', 
      desc: 'Attract top talent with beautiful, branded careers pages that convert candidates into applicants.',
      badge: '⭐ Core Feature'
    },
    { 
      icon: FiEye, 
      title: 'Live Preview', 
      desc: 'See real-time changes to your careers page before publishing. Perfect alignment guaranteed.',
      badge: '⭐ Core Feature'
    },
    { 
      icon: FiTrendingUp, 
      title: 'Analytics', 
      desc: 'Track job performance, application rates, and candidate engagement with detailed analytics.',
      badge: '📊 Pro Feature'
    },
    {
      icon: FiZap,
      title: 'Lightning Fast',
      desc: 'Optimized for speed and performance. Your careers page loads in milliseconds, everywhere.',
      badge: '⚡ Infrastructure'
    },
    {
      icon: FiShield,
      title: 'Enterprise Security',
      desc: 'Bank-level security with SSL encryption, regular backups, and compliance certifications.',
      badge: '🔒 Security'
    },
  ];

  const stats = [
    { number: '500+', label: 'Companies Using', suffix: 'and growing' },
    { number: '50K+', label: 'Jobs Posted', suffix: 'annually' },
    { number: '99.9%', label: 'Uptime', suffix: 'guaranteed' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section - FIXED PADDING */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-24 pb-32">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left: Text */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block"
              >
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  ✨ Launch Your Careers Page in Minutes
                </span>
              </motion.div>
              
              <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Build Beautiful
                <span className="block bg-linear-to-r from-blue-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Careers Pages
                </span>
              </h1>
            </div>

            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              Create stunning, responsive job boards without coding. Attract top talent, manage applications, and grow your team with CareerHub.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-xl font-semibold transition transform hover:scale-105"
                  >
                    Start hiring from your dashboard <FiArrowRight />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-xl font-semibold transition transform hover:scale-105"
                  >
                    Start Free Trial <FiArrowRight />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-300 text-gray-900 rounded-lg hover:border-blue-500 hover:bg-blue-50 font-semibold transition"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            <p className="text-sm text-gray-600">
              ✓ No credit card required • ✓ Free forever plan • ✓ Setup in 5 minutes
            </p>
          </motion.div>

          {/* Right: Visual - Hero Image Placeholder */}
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="relative h-[500px] bg-linear-to-br from-blue-400 via-blue-500 to-indigo-600 rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden"
            >
              {/* Decorative Elements */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-2xl" />
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
              </div>

              {/* Main Icon */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="text-white text-8xl drop-shadow-lg"
              >
                💼
              </motion.div>
            </motion.div>

            {/* Badge */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl"
            >
              <p className="text-3xl font-bold text-blue-600">50K+</p>
              <p className="text-sm text-gray-600">Jobs Posted</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Built for Modern Recruiting
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                CareerHub was created by recruiters, for recruiters. We understand the challenges
                of attracting top talent in today's competitive market.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our platform empowers you to create stunning, branded careers pages that showcase
                your company culture and make it easy for candidates to discover and apply to
                your open positions.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Used by 500+ companies worldwide</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">3x increase in quality applications</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Setup in under 10 minutes</span>
                </div>
              </div>
            </div>
            <div className="bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Why Choose CareerHub?</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-2xl">🎨</span>
                  <span>Beautiful, customizable designs that match your brand</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-2xl">⚡</span>
                  <span>Lightning-fast setup with no technical knowledge required</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-2xl">📱</span>
                  <span>Mobile-first design ensures great experience on any device</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-2xl">📊</span>
                  <span>Built-in analytics to track your recruitment performance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - PROPER SPACING */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl lg:text-6xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.suffix}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - PROPER SPACING */}
      <section id="features" className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              ⚡ Everything You Need
            </span>
          </motion.div>
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Powerful Features Made Simple
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            All the tools to create, manage, and optimize your company's careers page in one place
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl hover:bg-linear-to-br hover:from-blue-50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-100 p-4 rounded-xl group-hover:bg-blue-600 transition-all">
                    <Icon className="text-2xl text-blue-600 group-hover:text-white transition-all" />
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-700 rounded-full group-hover:bg-blue-100 group-hover:text-blue-700 transition-all">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Why Choose Section */}
      <section className="bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-32">
          <h2 className="text-5xl lg:text-6xl font-bold mb-20 text-center">Why Choose CareerHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              'No coding required',
              'Mobile responsive',
              'Real-time analytics',
              'Multi-currency support',
              'Custom branding',
              'Advanced filtering'
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-4"
              >
                <div className="shrink-0 mt-1">
                  <FiCheck className="text-2xl font-bold" />
                </div>
                <span className="text-lg font-semibold">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900">Ready to get started?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join companies building careers pages that actually explain the work and the team.
          </p>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-10 py-5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-xl font-semibold text-lg transition transform hover:scale-105"
            >
              Open your dashboard <FiArrowRight />
            </Link>
          ) : (
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-10 py-5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-xl font-semibold text-lg transition transform hover:scale-105"
            >
              Start Your Free Trial <FiArrowRight />
            </Link>
          )}
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-sm text-gray-600">hello@careerhub.com</p>
                </div>

                <div>
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                  <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                </div>

                <div>
                  <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Office</h3>
                  <p className="text-sm text-gray-600">San Francisco, CA</p>
                </div>
              </div>

              {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-10 py-5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-xl font-semibold text-lg transition transform hover:scale-105"
              >
                Open your dashboard <FiArrowRight />
              </Link>
            ) : (
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-10 py-5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-xl font-semibold text-lg transition transform hover:scale-105"
            >
              Start Your Free Trial <FiArrowRight />
            </Link>
          )}
            </div>
          </div>
        </div>
      </section>

      <ComingSoonModal
        isOpen={comingSoonOpen}
        onClose={() => setComingSoonOpen(false)}
        featureName="Feature Coming Soon"
      />
    </div>
  );
}
