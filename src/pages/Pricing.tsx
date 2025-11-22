import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';

export function Pricing() {
  const plans = [
    {
      name: 'Recruiter Starter',
      price: 'Free',
      cadence: 'for early teams',
      highlight: 'Set up one branded careers page and start posting roles without needing an ATS.',
      featured: false,
      audience: 'recruiter',
      features: [
        '1 recruiter workspace',
        '1 company careers page',
        'Up to 10 active jobs',
        'Content sections and FAQs',
      ],
    },
    {
      name: 'Recruiter Growth',
      price: 'Planned',
      cadence: '',
      highlight: 'For teams that want multiple hiring managers, more brands, and deeper insights.',
      featured: true,
      audience: 'recruiter',
      features: [
        'Multiple recruiter accounts',
        'Multiple company profiles',
        'Unlimited active jobs',
        'Featured jobs and spotlight sections',
        'Team-wide analytics (planned)',
      ],
    },
    {
      name: 'Candidate Companion',
      price: 'Planned',
      cadence: '',
      highlight: 'Give candidates their own space: saved jobs, profile, and basic recommendations.',
      featured: false,
      audience: 'candidate',
      features: [
        'Create a simple candidate profile (planned)',
        'Save and track interesting roles (planned)',
        'Email digests when new roles match interests (planned)',
      ],
    },
    {
      name: 'AI Career Coach',
      price: 'Planned',
      cadence: '',
      highlight: 'Future layer that uses AI to nudge candidates and recruiters in the right direction.',
      featured: false,
      audience: 'candidate',
      features: [
        'AI suggestions for roles to apply to (planned)',
        'Resume and profile feedback (planned)',
        'Learning resources and interview prep nudges (planned)',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-24 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
            Simple pricing for recruiters and candidates
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Pricing that scales
            <span className="block bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              with your team
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start with a free recruiter workspace. As you add more teams and eventually candidate accounts,
            you can grow into the plans that make sense for you.
          </p>
        </motion.div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 grid gap-8 md:grid-cols-3 items-stretch">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex flex-col rounded-3xl border p-8 shadow-sm bg-white ${
                plan.featured ? 'border-blue-500 shadow-xl scale-[1.02] relative' : 'border-gray-200'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-6 inline-flex items-center px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold shadow-sm">
                  Most popular
                </div>
              )}

              <div className="mb-6 text-left mt-2">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h2>
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                  {plan.audience === 'candidate' ? 'For candidates' : 'For recruiters'}
                </p>
                <p className="text-sm text-gray-600">{plan.highlight}</p>
              </div>

              <div className="mb-6 text-left">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  {plan.cadence && (
                    <span className="text-sm text-gray-500">{plan.cadence}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 text-left mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-gray-700">
                    <FiCheck className="mt-0.5 text-emerald-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`w-full py-3 rounded-lg font-semibold text-sm transition ${
                  plan.featured
                    ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-[1.02]'
                    : 'border border-gray-300 text-gray-800 hover:border-blue-500 hover:bg-blue-50'
                }`}
              >
                {plan.price === 'Free' ? 'Use free plan' : 'Coming soon'}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-white border-t border-gray-200 py-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Where this is going</h2>
          <p className="text-sm sm:text-base text-gray-600">
            Right now CareerHub focuses on giving recruiters a solid, branded careers page and a clean way to share
            open roles. The candidate and AI layers are intentionally called out as planned so it is clear what
            would come in a second phase.
          </p>
        </div>
      </section>
    </div>
  );
}
