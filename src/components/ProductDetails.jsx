import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ReviewForm from './ReviewForm.jsx';
import { API_BASE_URL } from '../config';

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!id) return;
    
    // Fetch product details
    fetch(`${API_BASE_URL}/api/products/${id}`)
      .then(response => {
        if (!response.ok) throw new Error('Product not found');
        return response.json();
      })
      .then(data => setProduct(data))
      .catch(error => console.error('Error fetching product:', error));

    // Fetch reviews for this product
    fetch(`${API_BASE_URL}/api/products/${id}/reviews`)
      .then(response => response.json())
      .then(data => setReviews(Array.isArray(data) ? data : []))
      .catch(error => console.error('Error fetching reviews:', error));
  }, [id]);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-neutral-600">Loading sports gear details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Product Details */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="aspect-square bg-gray-100">
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6 sm:p-8 lg:p-12 space-y-6 sm:space-y-8">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 mb-6">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                    KSh {product.price?.toLocaleString()}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium w-fit">
                    In Stock
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 leading-relaxed text-base sm:text-lg">{product.description}</p>
              
              <div className="space-y-3 sm:space-y-4">
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg hover:from-gray-800 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-base sm:text-lg"
                >
                  Add to Cart - KSh {product.price?.toLocaleString()}
                </button>
                <button className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300">
                  Add to Wishlist
                </button>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span>Free shipping</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>1 year warranty</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
        {/* Reviews Section */}
        <div className="mt-8 sm:mt-12">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Customer Reviews</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
              <div>
                {reviews.length > 0 ? (
                  <div className="space-y-4 sm:space-y-6">
                    {reviews.map(review => (
                      <div key={review.id} className="bg-gray-50 rounded-lg p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                          <div className="flex items-center">
                            <div className="flex text-yellow-400 mr-3">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 sm:w-5 sm:h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-gray-600 font-medium text-sm sm:text-base">{review.rating}/5</span>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-sm font-medium text-gray-900">{review.user_name}</p>
                            {review.created_at && (
                              <p className="text-xs text-gray-500">
                                {new Date(review.created_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-gray-500 text-base sm:text-lg">No reviews yet. Be the first to review this sports item!</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Write a Review</h3>
                <ReviewForm 
                  productId={id} 
                  onReviewAdded={(newReview) => {
                    setReviews([newReview, ...reviews]);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;