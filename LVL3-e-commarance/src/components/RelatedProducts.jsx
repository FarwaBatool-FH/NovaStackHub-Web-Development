// src/components/RelatedProducts.jsx
import { useState, useEffect } from "react";
import { fetchProductsByCategory } from "../services/productService";
import ProductCard from "./ProductCard";

const RelatedProducts = ({ category, currentProductId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchProductsByCategory(category).then((data) => {
      // Current product ko list se hata dena, aur max 4 products dikhana
      const filtered = data
        .filter((p) => p.id !== currentProductId)
        .slice(0, 4);
      setRelatedProducts(filtered);
      setLoading(false);
    });
  }, [category, currentProductId]);

  if (loading || relatedProducts.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <h2 className="text-xl font-bold text-white mb-6">
        You May Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;