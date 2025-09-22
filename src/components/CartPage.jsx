import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartPage() {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8 text-lg">Discover amazing products and start shopping today</p>
            <Link 
              to="/" 
              className="bg-gradient-to-r from-gray-900 to-gray-700 text-white font-semibold py-4 px-8 rounded-lg hover:from-gray-800 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 shadow-lg inline-block"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
          <p className="text-gray-600 text-lg">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="space-y-0">
            {items.map((item, index) => (
              <div key={item.id} className={`flex items-center gap-6 p-6 ${index !== items.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className="w-24 h-24 object-cover bg-gray-50 rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-2xl font-bold text-gray-900">KSh {item.price}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Order Summary</h3>
              <p className="text-gray-600">Review your items before checkout</p>
            </div>
            <button 
              onClick={clearCart}
              className="text-gray-400 hover:text-red-500 font-medium transition-colors duration-200"
            >
              Clear All
            </button>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-gray-900">Total: KSh {getCartTotal().toFixed(2)}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <button className="w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white font-bold py-4 px-8 rounded-lg hover:from-gray-800 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-lg">
              Proceed to Checkout
            </button>
            <Link 
              to="/" 
              className="block w-full text-center border-2 border-gray-300 text-gray-700 font-semibold py-4 px-8 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;