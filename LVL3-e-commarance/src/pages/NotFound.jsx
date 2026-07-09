// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <h1 className="text-8xl font-extrabold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
      <p className="text-gray-400 mb-8">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition"
      >
        ← Back to Home
      </Link>
    </div>
  );
};

export default NotFound;