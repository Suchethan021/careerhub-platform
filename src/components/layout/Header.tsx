import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiBriefcase, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { FaLinkedin, FaTwitter, FaGithub, FaFacebook } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState } from 'react';

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Companies', href: '/companies' },
    { label: 'Jobs', href: '/jobs-board' },
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

const navigate = useNavigate();

const scrollToSection = (href: string) => {
  if (href.startsWith('/#')) {
    const id = href.substring(2); // Remove '/#'

    // If not on homepage, navigate to homepage first, then scroll
    if (location.pathname !== '/') {
      navigate('/');
      return;
    }

    // If on homepage, scroll directly
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileOpen(false);
    }
  } else {
    navigate(href);
    setMobileOpen(false);
  }
};


  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 text-gray-900 hover:text-blue-600 transition">
            <FiBriefcase size={28} className="text-blue-600" />
            <span className="text-xl font-bold">CareerHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="text-gray-600 hover:text-gray-900 font-medium transition"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Side - Auth or Dashboard */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">{user?.email}</span>
                </div>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-blue-600 font-medium hover:text-blue-700 transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition"
                >
                  <FiLogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Social Icons */}
                <div className="flex items-center gap-3 mr-4">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-600 transition"
                  >
                    <FaLinkedin size={20} />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-400 transition"
                  >
                    <FaTwitter size={20} />
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-900 transition"
                  >
                    <FaGithub size={20} />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-700 transition"
                  >
                    <FaFacebook size={20} />
                  </a>
                </div>

                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900 transition"
                >
                  Recruiter Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition"
          >
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden border-t border-gray-200 bg-white"
        >
          <div className="px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                {link.label}
              </button>
            ))}

            <div className="border-t border-gray-200 pt-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-lg font-semibold"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="block w-full px-4 py-2 text-gray-700 text-center border border-gray-300 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full px-4 py-2 text-center text-gray-700 border border-gray-300 rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white text-center rounded-lg font-semibold"
                  >
                    Get Started
                  </Link>

                  {/* Mobile Social Icons */}
                  <div className="flex justify-center gap-6 pt-4">
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                      <FaLinkedin size={24} className="text-gray-400 hover:text-blue-600" />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                      <FaTwitter size={24} className="text-gray-400 hover:text-blue-400" />
                    </a>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                      <FaGithub size={24} className="text-gray-400 hover:text-gray-900" />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                      <FaFacebook size={24} className="text-gray-400 hover:text-blue-700" />
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
