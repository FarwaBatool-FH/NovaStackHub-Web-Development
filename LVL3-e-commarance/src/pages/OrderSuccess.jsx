// src/pages/OrderSuccess.jsx
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  // Agar koi direct is URL pr aa jaye bina order kiye, to home pr bhej dein
  useEffect(() => {
    if (!order) {
      navigate("/");
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-400 mb-6">
          Thank you, {order.customer.fullName}! Your order has been received.
        </p>

        <div className="bg-gray-900 rounded-xl p-5 text-left mb-6">
          <div className="flex justify-between mb-3">
            <span className="text-gray-400 text-sm">Order ID</span>
            <span className="text-white font-semibold text-sm">
              {order.orderId}
            </span>
          </div>
          <div className="flex justify-between mb-3">
            <span className="text-gray-400 text-sm">Order Date</span>
            <span className="text-white text-sm">{order.date}</span>
          </div>
          <div className="flex justify-between mb-3">
            <span className="text-gray-400 text-sm">Payment Method</span>
            <span className="text-white text-sm">
              {order.customer.paymentMethod === "cod"
                ? "Cash on Delivery"
                : "Credit / Debit Card"}
            </span>
          </div>
          <div className="flex justify-between mb-3">
            <span className="text-gray-400 text-sm">Delivery Address</span>
            <span className="text-white text-sm text-right">
              {order.customer.address}, {order.customer.city}
            </span>
          </div>
          <div className="border-t border-gray-700 mt-3 pt-3 flex justify-between">
            <span className="text-gray-300 font-medium">Total Paid</span>
            <span className="text-green-400 font-bold text-lg">
              Rs. {order.totals.total.toLocaleString()}
            </span>
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-6">
          A confirmation email has been sent to {order.customer.email}
        </p>

        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;