import React from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };
  return (
    <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden hover:-translate-y-2">
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full h-60 object-cover"
      />
      <div className="p-6 text-left">
        <h3 className="text-xl font-bold text-gray-700 mb-2">{product.name}</h3>
        <p className="text-gray-500 mb-4 h-12 overflow-hidden text-sm leading-relaxed">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-500">${product.price}</span>
          <button 
            onClick={handleAddToCart}
            className="bg-secondary-500 text-white font-bold py-2 px-6 rounded-full hover:bg-secondary-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;