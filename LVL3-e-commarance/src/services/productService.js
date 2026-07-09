// src/services/productService.js
import productsData from "../data/products-data.js";

// Simulate network delay (jaise real API call)
const SIMULATED_DELAY = 800;

// Fetch all products (jaise GET /api/products)
export const fetchProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(productsData);
    }, SIMULATED_DELAY);
  });
};

// Fetch single product by ID (jaise GET /api/products/:id)
export const fetchProductById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const product = productsData.find((p) => p.id === Number(id));
      if (product) {
        resolve(product);
      } else {
        reject(new Error("Product not found"));
      }
    }, SIMULATED_DELAY);
  });
};

// Fetch products by category (jaise GET /api/products?category=Electronics)
export const fetchProductsByCategory = (category) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (category === "All" || !category) {
        resolve(productsData);
      } else {
        resolve(productsData.filter((p) => p.category === category));
      }
    }, SIMULATED_DELAY);
  });
};

// Search products by title (jaise GET /api/products?search=shoes)
export const searchProducts = (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filtered = productsData.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase())
      );
      resolve(filtered);
    }, SIMULATED_DELAY);
  });
};

// Get all unique categories (jaise GET /api/categories)
export const fetchCategories = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const categories = [...new Set(productsData.map((p) => p.category))];
      resolve(["All", ...categories]);
    }, 300);
  });
};