import React, { useState, useEffect } from 'react';
import AdminProductForm from './AdminProductForm';
import AdminLogin from './AdminLogin';
import ChangePasswordModal from './ChangePasswordModal';
import { API_BASE_URL } from '../config';

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [inactivityTimer, setInactivityTimer] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      // Validate token by making a test request
      fetch(`${API_BASE_URL}/api/products`, {
        headers: { 'Authorization': `Bearer ${savedToken}` }
      })
      .then(response => {
        if (response.ok) {
          setToken(savedToken);
          setIsAuthenticated(true);
          fetchProducts(savedToken);
          resetInactivityTimer();
        } else {
          // Token is invalid, clear it
          localStorage.removeItem('adminToken');
          setLoading(false);
        }
      })
      .catch(() => {
        localStorage.removeItem('adminToken');
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProducts = (authToken = token) => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(response => response.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        if (error.message.includes('401')) {
          handleTokenExpired();
        } else {
          setProducts([]);
          setLoading(false);
        }
      });
  };

  const handleProductAdded = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setEditingProduct(null);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (response.status === 401) {
          handleTokenExpired();
          return;
        }
        if (response.ok) {
          setProducts(products.filter(p => p.id !== productId));
          resetInactivityTimer();
        }
      })
      .catch(error => console.error('Error deleting product:', error));
    }
  };

  const handleLogin = (authToken, isFirstLogin = false) => {
    setToken(authToken);
    setIsAuthenticated(true);
    fetchProducts(authToken);
    resetInactivityTimer();
    if (isFirstLogin) {
      setShowPasswordModal(true);
    }
  };

  const handleLogout = (reason = 'manual') => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    localStorage.removeItem('adminToken');
    setToken(null);
    setIsAuthenticated(false);
    setProducts([]);
    if (reason === 'inactivity') {
      alert('Session expired due to inactivity. Please log in again.');
    } else if (reason === 'expired') {
      alert('Session expired. Please log in again.');
    }
  };

  const resetInactivityTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    const timer = setTimeout(() => {
      handleLogout('inactivity');
    }, 5 * 60 * 1000); // 5 minutes
    setInactivityTimer(timer);
  };

  const handleTokenExpired = () => {
    handleLogout('expired');
  };

  // Add activity listeners
  useEffect(() => {
    if (isAuthenticated) {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      const resetTimer = () => resetInactivityTimer();
      
      events.forEach(event => {
        document.addEventListener(event, resetTimer, true);
      });
      
      return () => {
        events.forEach(event => {
          document.removeEventListener(event, resetTimer, true);
        });
        if (inactivityTimer) {
          clearTimeout(inactivityTimer);
        }
      };
    }
  }, [isAuthenticated, inactivityTimer]);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Sports Admin Panel</h1>
            <p className="text-gray-600 text-lg">Manage your sports gear and inventory</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Change Password
            </button>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Add/Edit Product Form */}
          <div>
            <AdminProductForm 
              onSubmit={editingProduct ? handleProductUpdated : handleProductAdded}
              initialValues={editingProduct}
              isEditing={!!editingProduct}
              onCancel={handleCancelEdit}
              token={token}
            />
          </div>

          {/* Products List */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Current Sports Gear ({products.length})</h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {products.map(product => (
                <div key={product.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-gray-600">KSh {product.price} • Stock: {product.stock}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <ChangePasswordModal 
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          token={token}
        />
      </div>
    </div>
  );
}

export default AdminPage;