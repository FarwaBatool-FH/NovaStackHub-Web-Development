// src/components/CartItem.jsx
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartItem = ({ item }) => {
  const { removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

  const itemTotal = item.discountPrice * item.quantity;

  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-gray-800 border border-gray-700 rounded-xl p-4">
      {/* Image */}
      <Link
        to={`/product/${item.id}`}
        className="w-full sm:w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-900"
      >
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <span className="text-xs text-blue-400 font-medium">
            {item.brand}
          </span>
          <Link to={`/product/${item.id}`}>
            <h3 className="text-white font-semibold hover:text-blue-400 transition line-clamp-1">
              {item.title}
            </h3>
          </Link>
          <p className="text-gray-400 text-sm mt-1">
            Rs. {item.discountPrice.toLocaleString()} each
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center border border-gray-700 rounded-lg">
            <button
              onClick={() => decreaseQuantity(item.id)}
              className="px-3 py-1 text-white hover:bg-gray-700 rounded-l-lg"
            >
              −
            </button>
            <span className="px-4 py-1 text-white border-x border-gray-700">
              {item.quantity}
            </span>
            <button
              onClick={() => increaseQuantity(item.id)}
              className="px-3 py-1 text-white hover:bg-gray-700 rounded-r-lg"
            >
              +
            </button>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-red-400 hover:text-red-300 text-sm font-medium"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Item Total */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
        <span className="text-white font-bold text-lg">
          Rs. {itemTotal.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default CartItem;