import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartPage() {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="bg-white rounded-2xl shadow-card p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-700 mb-6">Your Cart</h1>
          <p className="text-gray-600 text-lg mb-8">Your cart is empty</p>
          <Link 
            to="/" 
            className="bg-primary-500 text-white font-bold py-3 px-8 rounded-full hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-8 py-8">
      <div className="bg-white rounded-2xl shadow-card p-8">
        <h1 className="text-4xl font-bold text-gray-700 mb-8">Your Cart</h1>
        
        <div className="space-y-6">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-6 p-4 border border-gray-200 rounded-xl">
              <img 
                src={item.image_url} 
                alt={item.name} 
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-700">{item.name}</h3>
                <p className="text-primary-500 font-bold">${item.price}</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <span className="font-semibold w-8 text-center">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 font-semibold transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <span className="text-2xl font-bold text-gray-700">Total: ${getCartTotal().toFixed(2)}</span>
            <button 
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 font-semibold transition-colors"
            >
              Clear Cart
            </button>
          </div>
          <div className="flex gap-4">
            <Link 
              to="/" 
              className="bg-gray-500 text-white font-bold py-3 px-8 rounded-full hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Continue Shopping
            </Link>
            <button className="bg-secondary-500 text-white font-bold py-3 px-8 rounded-full hover:bg-secondary-600 transition-all duration-300 shadow-lg hover:shadow-xl">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;