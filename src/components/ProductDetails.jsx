import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ReviewForm from './ReviewForm.jsx';

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Fetch product details
    fetch(`/api/products/${id}`)
      .then(response => response.json())
      .then(data => setProduct(data))
      .catch(error => console.error('Error fetching product:', error));

    // Fetch reviews for this product
    fetch(`/api/products/${id}/reviews`)
      .then(response => response.json())
      .then(data => setReviews(data))
      .catch(error => console.error('Error fetching reviews:', error));
  }, [id]);

  if (!product) {
    return <div className="text-center mt-20 text-xl text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      <div className="bg-white rounded-2xl shadow-card p-8 mb-8">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full lg:w-1/2 max-w-lg rounded-xl shadow-lg"
          />
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-700 mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-primary-500 mb-6">${product.price}</p>
            <p className="text-gray-600 leading-relaxed mb-8 text-lg">{product.description}</p>
            <button 
              onClick={() => addToCart(product)}
              className="bg-secondary-500 text-white font-bold py-3 px-8 rounded-full hover:bg-secondary-600 transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-card p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Reviews</h2>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="border-b border-gray-200 pb-4">
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500 mr-2">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</span>
                  <span className="text-gray-600">Rating: {review.rating}/5</span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-card p-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Submit a Review</h2>
        <ReviewForm productId={id} />
      </div>
    </div>
  );
}

export default ProductDetails;