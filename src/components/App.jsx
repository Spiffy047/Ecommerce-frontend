import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import ProductList from './ProductList.jsx';
import ProductDetails from './ProductDetails.jsx';
import CartPage from './CartPage.jsx';
import AdminPage from './AdminPage.jsx';
import Footer from './Footer.jsx';
import '../index.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;