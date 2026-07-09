// src/pages/ProductDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";
import RelatedProducts from "../components/RelatedProducts";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setSelectedImage(0);
    setQuantity(1);

    fetchProductById(id)
      .then((data) => {
        setProduct(data);
        setLoading(false);
        window.scrollTo(0, 0);
      })
      .catch(() => {
        setError("Product not found.");
        setLoading(false);
      });
  }, [id]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={i < fullStars ? "text-yellow-400" : "text-gray-600"}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/cart");
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-red-400 text-lg mb-4">{error}</p>
        <Link to="/" className="text-blue-400 hover:underline">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/"
          className="text-gray-400 hover:text-blue-400 text-sm mb-6 inline-flex items-center gap-1"
        >
          ← Back to products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">
          {/* Left: Images */}
          <div>
            <div className="bg-gray-800 rounded-xl overflow-hidden h-96 mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-3">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? "border-blue-500"
                      : "border-gray-700"
                  }`}
                >
                  <img
                    src={img}
                    alt={`thumbnail-${index}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div>
            <span className="text-blue-400 text-sm font-medium">
              {product.brand}
            </span>
            <h1 className="text-3xl font-bold text-white mt-1 mb-3">
              {product.title}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-lg">{renderStars(product.rating)}</div>
              <span className="text-gray-400 text-sm">
                {product.rating} ({product.reviewsCount} reviews)
              </span>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl font-bold text-white">
                Rs. {product.discountPrice.toLocaleString()}
              </span>
              {product.discountPrice < product.price && (
                <>
                  <span className="text-gray-500 text-lg line-through">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                    -{product.discountPercent}%
                  </span>
                </>
              )}
            </div>

            <p
              className={`text-sm mb-6 ${
                product.stock > 10 ? "text-green-400" : "text-orange-400"
              }`}
            >
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
            </p>

            <p className="text-gray-300 leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-white font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-700 rounded-lg">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 text-white hover:bg-gray-800 rounded-l-lg"
                >
                  −
                </button>
                <span className="px-5 py-2 text-white border-x border-gray-700">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  className="px-4 py-2 text-white hover:bg-gray-800 rounded-r-lg"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4 mb-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
              >
                Buy Now
              </button>
            </div>

            {addedMessage && (
              <p className="text-green-400 text-sm text-center">
                ✓ Added to cart successfully!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        category={product.category}
        currentProductId={product.id}
      />
    </div>
  );
};

export default ProductDetail;