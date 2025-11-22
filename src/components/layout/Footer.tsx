// import { Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaGithub, FaInstagram } from 'react-icons/fa';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { useState } from 'react';
import { ComingSoonModal } from '../common/ComingSoonModal';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState('');

  const handleComingSoon = (feature: string) => {
    setComingSoonFeature(feature);
    setComingSoonOpen(true);
  };

  return (
    <>
      <footer className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-300 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-1 lg:col-span-1">
              <h3 className="text-white font-bold text-xl mb-4">CareerHub</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Build beautiful careers pages and attract top talent effortlessly.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition transform hover:scale-110"
                >
                  <FaLinkedin size={20} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition transform hover:scale-110"
                >
                  <FaTwitter size={20} />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-200 transition transform hover:scale-110"
                >
                  <FaGithub size={20} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-400 transition transform hover:scale-110"
                >
                  <FaInstagram size={20} />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Product</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => handleComingSoon('Features')}
                    className="text-gray-400 hover:text-white transition text-sm"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleComingSoon('Pricing')}
                    className="text-gray-400 hover:text-white transition text-sm"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleComingSoon('Integrations')}
                    className="text-gray-400 hover:text-white transition text-sm"
                  >
                    Integrations
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleComingSoon('API Documentation')}
                    className="text-gray-400 hover:text-white transition text-sm"
                  >
                    API Docs
                  </button>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Company</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => handleComingSoon('About Us')}
                    className="text-gray-400 hover:text-white transition text-sm"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleComingSoon('Blog')}
                    className="text-gray-400 hover:text-white transition text-sm"
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleComingSoon('Careers')}
                    className="text-gray-400 hover:text-white transition text-sm"
                  >
                    Careers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleComingSoon('Press')}
                    className="text-gray-400 hover:text-white transition text-sm"
                  >
                    Press
                  </button>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => handleComingSoon('Help Center')}
                    className="text-gray-400 hover:text-white transition text-sm"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleComingSoon('Documentation')}
                    className="text-gray-400 hover:text-white transition text-sm"
                  >
                    Documentation
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleComingSoon('Community')}
                    className="text-gray-400 hover:text-white transition text-sm"
                  >
                    Community
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleComingSoon('Status')}
                    className="text-gray-400 hover:text-white transition text-sm"
                  >
                    Status
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <FiMail className="text-blue-400 mt-1 shrink-0" />
                  <a href="mailto:kummajellasuchethan@gmail.com" className="text-gray-400 hover:text-white transition text-sm">
                    hello@careerhub.com
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <FiPhone className="text-blue-400 mt-1 shrink-0" />
                  <a href="tel:+1234567890" className="text-gray-400 hover:text-white transition text-sm">
                    +1 (234) 567-890
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <FiMapPin className="text-blue-400 mt-1 shrink-0" />
                  <span className="text-gray-400 text-sm">San Francisco, CA</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 mb-8"></div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© {currentYear} CareerHub. All rights reserved. Made with ❤️ for recruiters.</p>
            <div className="flex gap-6">
              <button
                onClick={() => handleComingSoon('Privacy Policy')}
                className="hover:text-white transition"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => handleComingSoon('Terms of Service')}
                className="hover:text-white transition"
              >
                Terms of Service
              </button>
              <button
                onClick={() => handleComingSoon('Cookie Policy')}
                className="hover:text-white transition"
              >
                Cookies
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={comingSoonOpen}
        onClose={() => setComingSoonOpen(false)}
        featureName={comingSoonFeature}
        description={`${comingSoonFeature} is coming soon! We're actively working on this feature.`}
      />
    </>
  );
}
