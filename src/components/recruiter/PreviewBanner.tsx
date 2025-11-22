import { FiEye, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export function PreviewBanner() {
  return (
    <div className="bg-yellow-500 text-yellow-900 px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-lg">
      <div className="flex items-center gap-3">
        <FiEye size={20} />
        <div>
          <p className="font-semibold">Preview Mode</p>
          <p className="text-sm">This is how your careers page will look when published.</p>
        </div>
      </div>
      <Link
        to="/dashboard"
        className="flex items-center gap-2 px-4 py-2 bg-yellow-900 text-yellow-100 rounded-lg hover:bg-yellow-800 transition"
      >
        <FiX size={16} />
        Exit Preview
      </Link>
    </div>
  );
}
