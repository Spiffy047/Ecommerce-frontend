// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Navbar({ user: propUser }) {
  const { getCartItemsCount } = useCart();
  const cartCount = getCartItemsCount();
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(propUser);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }

    const handleUserLogin = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };

    window.addEventListener('userLogin', handleUserLogin);
    return () => window.removeEventListener('userLogin', handleUserLogin);
  }, []);

  useEffect(() => {
    setUser(propUser);
  }, [propUser]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('userLogout'));
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-lg">S</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gray-900">
              SportZone
            </span>
          </Link>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative md:hidden">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-32 px-3 py-1 pl-8 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <button type="submit" className="absolute left-2 top-1/2 transform -translate-y-1/2">
                <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search sports gear..."
                className="w-64 lg:w-80 px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-500 hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
            <Link 
              to="/" 
              className="hidden lg:block text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              Shop
            </Link>
            
            {user?.is_admin && (
              <Link 
                to="/admin" 
                className="hidden sm:block text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
              >
                Admin
              </Link>
            )}
            
            <Link 
              to="/cart" 
              className="relative flex items-center space-x-1 sm:space-x-2 text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 bg-gray-100 hover:bg-gray-200 px-2 sm:px-4 py-2 rounded-full"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full min-w-[1.25rem] h-5 sm:min-w-[1.5rem] sm:h-6 flex items-center justify-center">{cartCount}</span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-1 sm:space-x-2 text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 bg-indigo-100 hover:bg-indigo-200 px-2 sm:px-4 py-2 rounded-full"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden sm:inline truncate max-w-20">{user.name}</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Profile
                    </Link>
                    {user?.is_admin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 sm:hidden"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 text-sm sm:text-base"
                >
                  Sign In
                </Link>
                <Link
                  to="/admin-login"
                  className="bg-red-600 text-white px-2 sm:px-4 py-2 rounded-full hover:bg-red-700 transition-colors duration-200 text-xs sm:text-sm font-medium"
                >
                  Admin
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  );
}

export default Navbar;