import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import ProductList from './ProductList.jsx';
import ProductDetails from './ProductDetails.jsx';
import CartPage from './CartPage.jsx';
import '../App.css';

function App() {
  return (
    <div className="min-h-screen bg-primary-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </div>
  );
}

export default App;