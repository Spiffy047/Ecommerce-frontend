import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartPage() {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  const handleCheckout = async () => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity
          }))
        })
      });

      const data = await response.json();

      if (response.ok) {
        setOrderId(data.order_id);
        setOrderComplete(true);
        clearCart();
      } else {
        alert(data.error || 'Checkout failed');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <svg className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-green-500 mx-auto mb-4 sm:mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-2 text-base sm:text-lg">Thank you for your purchase, {user?.name}!</p>
            <p className="text-gray-500 mb-6 sm:mb-8">Order #{orderId}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/profile" 
                className="bg-gradient-to-r from-gray-900 to-gray-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg hover:from-gray-800 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                View Order History
              </Link>
              <Link 
                to="/" 
                className="border-2 border-gray-300 text-gray-700 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <svg className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-gray-300 mx-auto mb-4 sm:mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg">Discover amazing products and start shopping today</p>
            <Link 
              to="/" 
              className="bg-gradient-to-r from-gray-900 to-gray-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg hover:from-gray-800 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 shadow-lg inline-block"
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Shopping Cart</h1>
          <p className="text-gray-600 text-base sm:text-lg">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>
        
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden mb-6 sm:mb-8">
          <div className="space-y-0">
            {items.map((item, index) => (
              <div key={item.id} className={`flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 ${index !== items.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover bg-gray-50 rounded-lg mx-auto sm:mx-0"
                />
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">{item.name}</h3>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">KSh {item.price?.toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-center sm:justify-start space-x-3">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-8 sm:w-12 text-center font-semibold text-base sm:text-lg">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 mx-auto sm:mx-0"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-2 sm:space-y-0">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Order Summary</h3>
              <p className="text-gray-600 text-sm sm:text-base">Review your items before checkout</p>
            </div>
            <button 
              onClick={clearCart}
              className="text-gray-400 hover:text-red-500 font-medium transition-colors duration-200 text-sm sm:text-base self-start sm:self-auto"
            >
              Clear All
            </button>
          </div>
          
          <div className="border-t border-gray-200 pt-4 sm:pt-6 mb-6 sm:mb-8">
            <div className="flex justify-between items-center">
              <span className="text-xl sm:text-2xl font-bold text-gray-900">Total: KSh {getCartTotal().toLocaleString()}</span>
            </div>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {user && token ? (
              <button 
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg hover:from-gray-800 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-base sm:text-lg disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            ) : (
              <Link
                to="/login"
                className="block w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg hover:from-gray-800 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-base sm:text-lg text-center"
              >
                Sign In to Checkout
              </Link>
            )}
            <Link 
              to="/" 
              className="block w-full text-center border-2 border-gray-300 text-gray-700 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
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