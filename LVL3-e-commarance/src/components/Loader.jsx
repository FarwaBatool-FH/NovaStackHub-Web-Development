// src/components/Loader.jsx
const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-400 text-sm">Loading products...</p>
    </div>
  );
};

export default Loader;