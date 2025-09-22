// src/components/ProductCard.jsx
import React from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };
  
  return (
    <div className="group bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-gray-900">
            KSh {product.price}
          </span>
        </div>
        <button 
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-gray-800 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;