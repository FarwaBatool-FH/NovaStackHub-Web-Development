// src/components/CategoryFilter.jsx
const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
            selectedCategory === category
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-gray-800 text-gray-300 border-gray-700 hover:border-blue-500 hover:text-blue-400"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;