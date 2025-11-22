import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiUsers, FiHeart, FiArrowRight } from 'react-icons/fi';

export function About() {
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
              Built for modern teams and ambitious candidates
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              The story behind
              <span className="block bg-linear-to-r from-blue-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CareerHub
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl">
              CareerHub was created to make careers pages feel less like static job boards and more like
              living, breathing stories of the teams behind them. We help companies stand out and help
              candidates find work that actually fits them.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:shadow-xl hover:scale-105 transition"
              >
                Get started as a recruiter
                <FiArrowRight />
              </Link>
              <Link
                to="/companies"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 text-gray-800 font-semibold hover:border-blue-500 hover:bg-blue-50 transition"
              >
                Explore hiring companies
              </Link>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FiBriefcase className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">For recruiters</h3>
                <p className="text-sm text-gray-600">
                  Launch a branded careers page in minutes, showcase your culture, and manage jobs without
                  needing a designer or engineer.
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <FiUsers className="text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">For candidates</h3>
                <p className="text-sm text-gray-600">
                  Discover companies through rich stories, not just bullet points. Filter jobs, read details,
                  and decide where you truly want to work.
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <FiHeart className="text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900">For teams</h3>
                <p className="text-sm text-gray-600">
                  Bring hiring managers, founders, and recruiters into one place to tell a unified story about
                  why your company is a great place to work.
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <span className="text-amber-600 text-lg font-bold">∞</span>
                </div>
                <h3 className="font-semibold text-gray-900">Built to grow</h3>
                <p className="text-sm text-gray-600">
                  Designed as a multi-tenant SaaS from day one, with Supabase, row level security, and clean
                  routing for each company.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="bg-white border-t border-gray-200 py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">What we value</h2>
              <p className="text-lg text-gray-600 mb-6">
                CareerHub is opinionated about what great hiring looks like: clear storytelling, fast
                experiences, and respectful communication with candidates.
              </p>
              <ul className="space-y-4 text-gray-700">
                <li className="flex gap-3">
                  <span className="mt-1 text-blue-600">•</span>
                  <span>
                    <strong>Transparency.</strong> Candidates should know what they are applying to—role,
                    expectations, and salary ranges.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 text-blue-600">•</span>
                  <span>
                    <strong>Speed.</strong> Recruiters should not need weeks of design and engineering help to
                    publish a great careers page.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 text-blue-600">•</span>
                  <span>
                    <strong>Craft.</strong> Little details—icons, spacing, typography—matter when you are asking
                    someone to trust your brand with their career.
                  </span>
                </li>
              </ul>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              className="grid sm:grid-cols-2 gap-6"
            >
              <motion.div
                variants={item}
                className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6"
              >
                <p className="text-sm font-semibold text-blue-600 mb-2">For recruiters</p>
                <p className="text-gray-700 mb-3">
                  Ship your first careers page in a single afternoon. No engineers required.
                </p>
                <p className="text-xs text-gray-500">
                  Multi-company, slug based routing and Supabase RLS keep each tenant isolated and safe.
                </p>
              </motion.div>
              <motion.div
                variants={item}
                className="bg-linear-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6"
              >
                <p className="text-sm font-semibold text-emerald-600 mb-2">For candidates</p>
                <p className="text-gray-700 mb-3">
                  Browse companies, filter jobs, and open a focused job detail view without losing context.
                </p>
                <p className="text-xs text-gray-500">
                  Client-side filters, modals, and responsive layouts make searching feel effortless.
                </p>
              </motion.div>
              <motion.div
                variants={item}
                className="bg-linear-to-br from-purple-50 to-fuchsia-50 border border-purple-100 rounded-2xl p-6"
              >
                <p className="text-sm font-semibold text-purple-600 mb-2">For hiring today</p>
                <p className="text-gray-700 mb-3">
                  The current version is focused on one thing: making it easy to ship a clean, believable careers
                  page with real jobs and real content.
                </p>
                <p className="text-xs text-gray-500">
                  You can talk about your team, culture, and open roles without needing to wire up a full ATS.
                </p>
              </motion.div>
              <motion.div
                variants={item}
                className="bg-linear-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-6"
              >
                <p className="text-sm font-semibold text-slate-700 mb-2">Ideas for phase 2</p>
                <p className="text-gray-700 mb-3">
                  Later, this same foundation can grow into candidate accounts, saved jobs, and AI helpers that
                  recommend roles or suggest what to improve in a profile.
                </p>
                <p className="text-xs text-gray-500">
                  Those pieces are intentionally left as planned so that this version stays small, testable, and
                  easy to reason about.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">Ready to tell a better hiring story?</h2>
            <p className="text-sm sm:text-base text-white/80 max-w-xl">
              Create your company profile, add a few jobs, and publish a careers page that you are proud to share
              with candidates.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-white text-blue-700 font-semibold hover:bg-blue-50 transition"
            >
              Start free as a recruiter
              <FiArrowRight />
            </Link>
            <Link
              to="/companies"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/40 text-white font-semibold hover:bg-white/10 transition"
            >
              Browse companies
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
