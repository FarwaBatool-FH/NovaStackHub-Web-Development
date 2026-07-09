// src/pages/Cart.jsx
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { calculateTotals } from "../utils/calculateTotals";
import CartItem from "../components/CartItem";

const Cart = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const { subtotal, shipping, tax, total } = calculateTotals(cartItems);

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-400 mb-6">
          Looks like you haven't added anything yet.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">
        Shopping Cart ({cartItems.length})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-white mb-4">
              Order Summary
            </h2>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-400">Free</span>
                  ) : (
                    `Rs. ${shipping.toLocaleString()}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Tax (5%)</span>
                <span>Rs. {tax.toLocaleString()}</span>
              </div>

              <div className="border-t border-gray-700 pt-3 flex justify-between text-white font-bold text-lg">
                <span>Total</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {subtotal < 5000 && (
              <p className="text-orange-400 text-xs mt-3">
                Add Rs. {(5000 - subtotal).toLocaleString()} more for free
                shipping!
              </p>
            )}

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mt-5 transition"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/"
              className="block text-center text-gray-400 hover:text-blue-400 text-sm mt-4"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;