import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

function ReviewForm({ productId, onReviewAdded }) {
  const [formData, setFormData] = useState({ rating: '', comment: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  if (!user || !token) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600 mb-4">Please sign in to write a review</p>
        <a 
          href="/login" 
          className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Sign In
        </a>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: parseInt(formData.rating),
          comment: formData.comment
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Review submitted successfully!');
        setFormData({ rating: '', comment: '' });
        if (onReviewAdded) {
          onReviewAdded(data);
        }
      } else {
        setError(data.error || 'Failed to submit review');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm">
          {message}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Rating
        </label>
        <select 
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
          required
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
        >
          <option value="">Select rating</option>
          <option value="1">1 Star</option>
          <option value="2">2 Stars</option>
          <option value="3">3 Stars</option>
          <option value="4">4 Stars</option>
          <option value="5">5 Stars</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Your Review
        </label>
        <textarea 
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          required
          rows="5"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none resize-none"
          placeholder="Share your experience with this product..."
        />
      </div>
      
      <button 
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-gray-800 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

export default ReviewForm;