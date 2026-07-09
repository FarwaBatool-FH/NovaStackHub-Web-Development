// src/components/ProductCardSkeleton.jsx
const ProductCardSkeleton = () => {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 animate-pulse">
      {/* Image placeholder */}
      <div className="h-52 bg-gray-700"></div>

      <div className="p-4 flex flex-col gap-3">
        {/* Brand placeholder */}
        <div className="h-3 bg-gray-700 rounded w-1/3"></div>

        {/* Title placeholder */}
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3"></div>

        {/* Rating placeholder */}
        <div className="h-3 bg-gray-700 rounded w-1/2"></div>

        {/* Price placeholder */}
        <div className="h-5 bg-gray-700 rounded w-1/3"></div>

        {/* Button placeholder */}
        <div className="h-10 bg-gray-700 rounded-lg w-full mt-1"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;