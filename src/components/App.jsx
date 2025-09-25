import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import Navbar from './Navbar.jsx';
import ProductList from './ProductList.jsx';
import ProductDetails from './ProductDetails.jsx';
import CartPage from './CartPage.jsx';
import AdminPage from './AdminPage.jsx';
import UserAuth from './UserAuth.jsx';
import AdminAuth from './AdminAuth.jsx';
import UserProfile from './UserProfile.jsx';
import Footer from './Footer.jsx';
import '../index.css';

// Protected Route Component
const ProtectedRoute = ({ children, requireAuth = false, requireAdmin = false }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  if (requireAuth && (!user || !token)) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && (!user || !user.is_admin)) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    window.dispatchEvent(new Event('userLogin'));
  };

  const handleAdminLogin = (userData) => {
    setUser(userData);
    window.dispatchEvent(new Event('userLogin'));
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar user={user} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<UserAuth onLogin={handleLogin} />} />
            <Route path="/admin-login" element={<AdminAuth onAdminLogin={handleAdminLogin} />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;