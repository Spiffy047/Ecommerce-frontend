// src/components/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };
  
  return (
    <div className="group relative bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden bg-gray-50 relative">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Hover Add to Cart Button - Desktop */}
          <button 
            onClick={handleAddToCart}
            className="absolute inset-x-4 bottom-4 bg-gray-900 text-white font-semibold py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-800 hidden md:block"
          >
            Add to Cart
          </button>
        </div>
        <div className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              KSh {product.price?.toLocaleString()}
            </span>
          </div>
          {/* Mobile Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            className="w-full bg-gray-900 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 md:hidden block"
          >
            Add to Cart
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;