// src/pages/Checkout.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { calculateTotals } from "../utils/calculateTotals";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const { subtotal, shipping, tax, total } = calculateTotals(cartItems);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "cod",
  });

  const [errors, setErrors] = useState({});

  // Agar cart khali hai to Cart page pr wapis bhej dein
  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Type krtay waqt error clear kr dein
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,11}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Enter a valid phone number";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.postalCode.trim())
      newErrors.postalCode = "Postal code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Order details generate krna (real backend na hone ki wja se local hi rakhtay hain)
    const orderId = `ORD-${Date.now().toString().slice(-8)}`;
    const orderDetails = {
      orderId,
      items: cartItems,
      customer: formData,
      totals: { subtotal, shipping, tax, total },
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };

    // Cart clear krna aur success page pr order details k sath navigate krna
    clearCart();
    navigate("/order-success", { state: { order: orderDetails } });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handlePlaceOrder}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex flex-col gap-5"
          >
            <h2 className="text-lg font-semibold text-white">
              Shipping Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="03001234567"
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="House # 123, Street 4"
              />
              {errors.address && (
                <p className="text-red-400 text-xs mt-1">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Lahore"
                />
                {errors.city && (
                  <p className="text-red-400 text-xs mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="54000"
                />
                {errors.postalCode && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.postalCode}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">
                Payment Method
              </h2>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleChange}
                    className="accent-blue-600"
                  />
                  <span className="text-white text-sm">Cash on Delivery</span>
                </label>
                <label className="flex items-center gap-3 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === "card"}
                    onChange={handleChange}
                    className="accent-blue-600"
                  />
                  <span className="text-white text-sm">
                    Credit / Debit Card
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg mt-2 transition"
            >
              Place Order
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-white mb-4">
              Order Summary
            </h2>

            <div className="flex flex-col gap-3 max-h-64 overflow-y-auto mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-gray-400 text-xs">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="text-white text-sm font-medium">
                    Rs. {(item.discountPrice * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-700 pt-3 flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? "Free" : `Rs. ${shipping.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Tax</span>
                <span>Rs. {tax.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-700 pt-2 flex justify-between text-white font-bold">
                <span>Total</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;