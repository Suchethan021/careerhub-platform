import { motion } from 'framer-motion';
import { FiBriefcase, FiUsers, FiEye, FiZap, FiLayout, FiSearch, FiShield } from 'react-icons/fi';

export function Features() {
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const item = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  const recruiterFeatures = [
    {
      icon: FiBriefcase,
      title: 'Job manager',
      desc: 'Create, edit, and close roles in a simple dashboard connected directly to your Supabase jobs table.',
    },
    {
      icon: FiLayout,
      title: 'Branded careers pages',
      desc: 'Use your logo, colors, and mission statement to create a unique page for every company.',
    },
    {
      icon: FiEye,
      title: 'Preview before publish',
      desc: 'Use preview mode to see exactly what candidates see before sharing your public URL.',
    },
    {
      icon: FiShield,
      title: 'Secure multi-tenant data',
      desc: 'Supabase Row Level Security keeps each recruiter’s company and jobs isolated by user id.',
    },
  ];

  const candidateFeatures = [
    {
      icon: FiSearch,
      title: 'Search & filters',
      desc: 'Filter jobs by location, type, and experience level and search by title on each careers page.',
    },
    {
      icon: FiUsers,
      title: 'Company discovery',
      desc: 'Browse published companies, see open roles, and click into the careers experience that feels right.',
    },
    {
      icon: FiEye,
      title: 'Focused job details',
      desc: 'Open a modal with full job details without losing your place in the list of opportunities.',
    },
    {
      icon: FiZap,
      title: 'Fast & responsive',
      desc: 'Built with React + Vite + Tailwind to feel snappy on desktop and mobile devices.',
    },
  ];

  const stepsRecruiter = [
    'Sign up and create your company profile.',
    'Add your first open roles from the Job Manager.',
    'Publish your careers page and share the public URL.',
  ];

  const stepsCandidate = [
    'Visit /companies to discover hiring teams.',
    'Open a company careers page and filter roles.',
    'Open a job detail to understand if the role fits you.',
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
            Features for both sides of the hiring table
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Everything you need to
            <span className="block bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              attract and evaluate talent
            </span>
          </h1>
          <p className="text-lg text-gray-600">
            CareerHub combines a recruiter-friendly job manager with a beautiful, candidate-friendly careers
            browsing experience. All backed by a clean Supabase schema.
          </p>
        </motion.div>
      </section>

      {/* Recruiter & candidate features */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 grid lg:grid-cols-2 gap-10 items-start">
          <motion.div variants={container} initial="hidden" whileInView="visible" className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">For recruiters</h2>
            <p className="text-sm sm:text-base text-gray-600">
              Design a consistent, branded hiring experience and keep your open roles organized without needing a
              full ATS.
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
              {recruiterFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    variants={item}
                    className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
                      <Icon className="text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={container} initial="hidden" whileInView="visible" className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">For candidates</h2>
            <p className="text-sm sm:text-base text-gray-600">
              Help candidates understand your teams, roles, and expectations quickly so they can apply with
              confidence.
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
              {candidateFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    variants={item}
                    className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mb-3">
                      <Icon className="text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-gray-200 py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">How CareerHub works</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              A simple sequence for both recruiters and candidates so you can explain the flow in your
              assignment and to real users.
            </p>
            <div className="space-y-4">
              {stepsRecruiter.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">What candidates experience</h3>
            <div className="space-y-4">
              {stepsCandidate.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-semibold mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
