import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReviewForm from './ReviewForm.jsx';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Fetch product details
    fetch(`/products/${id}`)
      .then(response => response.json())
      .then(data => setProduct(data))
      .catch(error => console.error('Error fetching product:', error));

    // Fetch reviews for this product
    fetch(`/products/${id}/reviews`)
      .then(response => response.json())
      .then(data => setReviews(data))
      .catch(error => console.error('Error fetching reviews:', error));
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      
      <h2>Reviews</h2>
      {reviews.map(review => (
        <div key={review.id}>
          <p>Rating: {review.rating}</p>
          <p>{review.comment}</p>
        </div>
      ))}

      <h2>Submit a Review</h2>
      <ReviewForm productId={id} />
    </div>
  );
}

export default ProductDetails;