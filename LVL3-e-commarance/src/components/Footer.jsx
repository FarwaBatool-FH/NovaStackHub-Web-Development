// src/components/Footer.jsx
const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-blue-500 mb-3">
              ShopEase
            </h3>
            <p className="text-gray-400 text-sm">
              Your one-stop destination for quality products at the best
              prices.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-blue-400 cursor-pointer">
                About Us
              </li>
              <li className="hover:text-blue-400 cursor-pointer">
                Contact
              </li>
              <li className="hover:text-blue-400 cursor-pointer">
                FAQs
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Customer Service</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-blue-400 cursor-pointer">
                Shipping Policy
              </li>
              <li className="hover:text-blue-400 cursor-pointer">
                Returns
              </li>
              <li className="hover:text-blue-400 cursor-pointer">
                Track Order
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Follow Us</h4>
            <div className="flex gap-4 text-gray-400">
              <span className="hover:text-blue-400 cursor-pointer">
                Facebook
              </span>
              <span className="hover:text-blue-400 cursor-pointer">
                Instagram
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
          © 2026 ShopEase. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;