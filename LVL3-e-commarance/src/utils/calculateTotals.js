// src/utils/calculateTotals.js

export const calculateTotals = (cartItems) => {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.discountPrice * item.quantity,
    0
  );

  // Free shipping agar order 5000 se zyada ho, warna 250 charge
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 250;

  // 5% tax
  const tax = Math.round(subtotal * 0.05);

  const total = subtotal + shipping + tax;

  return {
    subtotal,
    shipping,
    tax,
    total,
  };
};