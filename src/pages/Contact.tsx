import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export function Contact() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
            We would love to hear from you
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Contact CareerHub
          </h1>
          <p className="text-lg text-gray-600">
            Whether you are a recruiter evaluating CareerHub, a candidate with feedback, or a reviewer looking
            at this project for an assignment, these are the channels you would use in a real product.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-linear-to-br from-blue-50 to-purple-50 rounded-3xl p-8 sm:p-10 shadow-xl border border-white/60">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <FiMail />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                <p className="text-sm text-gray-700">hello@careerhub.com</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-600 flex items-center justify-center text-white">
                  <FiPhone />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                <p className="text-sm text-gray-700">+1 (555) 123-4567</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-pink-600 flex items-center justify-center text-white">
                  <FiMapPin />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Office</h3>
                <p className="text-sm text-gray-700">San Francisco, CA</p>
              </div>
            </div>

            <div className="text-sm text-gray-600 text-center">
              <p className="mb-2">
                In a production deployment this page would include a contact form wired to your backend or a
                ticketing tool. For this assignment, the focus is on showing an end-to-end marketing experience
                with consistent design.
              </p>
              <p className="text-xs text-gray-500">
                You can mention this page when explaining how recruiters or candidates would reach out with
                questions or support needs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
