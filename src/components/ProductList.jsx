import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/products') // <-- Corrected URL here
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products. Please try again later.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center mt-20">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  return (
    <div className="px-8 py-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-700">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {products.map(product => (
          <Link key={product.id} to={`/products/${product.id}`} className="block">
            <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden hover:-translate-y-2">
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-60 object-cover"
              />
              <div className="p-6 text-left">
                <h2 className="text-xl font-bold text-gray-700 mb-2">{product.name}</h2>
                <p className="text-2xl font-bold text-primary-500">${product.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProductList;