import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  description?: string;
}

export function ComingSoonModal({ isOpen, onClose, featureName, description }: ComingSoonModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{featureName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="bg-linear-to-br from-blue-100 to-indigo-100 rounded-xl p-8 mb-6 flex items-center justify-center">
          <div className="text-6xl animate-bounce">🚀</div>
        </div>

        <p className="text-gray-600 mb-4">
          {description || 'This feature is currently in development and will be available soon.'}
        </p>

        <p className="text-sm text-gray-500 mb-6">
          We're working hard to bring this amazing feature to you!
        </p>

        <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
        >
          Got it!
        </button>
      </motion.div>
    </motion.div>
  );
}
