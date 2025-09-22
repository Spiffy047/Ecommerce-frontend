import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { getCartItemsCount } = useCart();
  const cartCount = getCartItemsCount();
  return (
    <nav className="bg-white px-12 py-5 shadow-card flex justify-between items-center mb-8">
      <div className="text-2xl font-bold text-gray-700">ECommerce</div>
      <ul className="flex gap-8">
        <li>
          <Link 
            to="/" 
            className="text-gray-500 font-semibold hover:text-gray-600 transition-colors duration-300 relative group"
          >
            Products
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </li>
        <li>
          <Link 
            to="/cart" 
            className="text-gray-500 font-semibold hover:text-gray-600 transition-colors duration-300 relative group flex items-center gap-2"
          >
            Cart
            {cartCount > 0 && (
              <span className="bg-secondary-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                {cartCount}
              </span>
            )}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;