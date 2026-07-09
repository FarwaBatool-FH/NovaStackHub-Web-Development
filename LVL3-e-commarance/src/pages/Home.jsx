// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  fetchProducts,
  fetchCategories,
  searchProducts,
} from "../services/productService";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import ProductCardSkeleton from "../components/ProductCardSkeleton";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");

  useEffect(() => {
    fetchCategories().then((data) => setCategories(data));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (searchQuery) {
      searchProducts(searchQuery)
        .then((data) => {
          setProducts(data);
          setLoading(false);
        })
        .catch(() => {
          setError("Something went wrong while searching.");
          setLoading(false);
        });
    } else {
      fetchProducts()
        .then((data) => {
          setProducts(data);
          setLoading(false);
        })
        .catch(() => {
          setError("Something went wrong while loading products.");
          setLoading(false);
        });
    }
  }, [searchQuery]);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {searchQuery && (
        <h2 className="text-xl text-white mb-6">
          Search results for:{" "}
          <span className="text-blue-400 font-semibold">"{searchQuery}"</span>
        </h2>
      )}

      {!searchQuery && categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      )}

      {/* Loading State - Skeleton Grid */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-16">
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">
            No products found. Try a different search or category.
          </p>
        </div>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;