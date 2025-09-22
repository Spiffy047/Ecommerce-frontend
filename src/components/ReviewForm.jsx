import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ReviewSchema = Yup.object().shape({
  rating: Yup.number()
    .required('Rating is required')
    .typeError('Rating must be a number')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5')
    .integer('Rating must be a whole number'),
  comment: Yup.string()
    .required('Comment is required')
    .min(10, 'Comment must be at least 10 characters')
    .max(500, 'Comment must be less than 500 characters')
    .matches(/^[a-zA-Z0-9\s.,!?'-]+$/, 'Comment contains invalid characters')
});

function ReviewForm({ productId, onReviewAdded }) {
  return (
    <Formik
      initialValues={{ rating: '', comment: '' }}
      validationSchema={ReviewSchema}
      onSubmit={(values, { resetForm, setSubmitting, setStatus }) => {
        setSubmitting(true);
        setStatus(null);
        
        fetch(`/api/products/${productId}/reviews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            rating: parseInt(values.rating),
            comment: values.comment
          })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to submit review');
          }
          return response.json();
        })
        .then(data => {
          console.log('Review submitted:', data);
          resetForm();
          setStatus({ type: 'success', message: 'Review submitted successfully!' });
          if (onReviewAdded) {
            onReviewAdded(data);
          }
        })
        .catch(error => {
          console.error('Error submitting review:', error);
          setStatus({ type: 'error', message: 'Failed to submit review. Please try again.' });
        })
        .finally(() => {
          setSubmitting(false);
        });
      }}
    >
      {({ isSubmitting, status }) => (
      <Form className="space-y-6">
        {status && (
          <div className={`p-3 rounded-lg text-sm ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {status.message}
          </div>
        )}
        <div>
          <label htmlFor="rating" className="block text-sm font-semibold text-gray-900 mb-3">
            Rating
          </label>
          <Field 
            name="rating" 
            type="number" 
            min="1" 
            max="5"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-all duration-200"
            placeholder="Rate from 1 to 5"
          />
          <ErrorMessage name="rating" component="div" className="text-red-500 text-sm mt-2" />
        </div>
        
        <div>
          <label htmlFor="comment" className="block text-sm font-semibold text-gray-900 mb-3">
            Your Review
          </label>
          <Field 
            name="comment" 
            as="textarea" 
            rows="5"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none resize-none transition-all duration-200"
            placeholder="Share your experience with this product..."
          />
          <ErrorMessage name="comment" component="div" className="text-red-500 text-sm mt-2" />
        </div>
        
        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-gray-800 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </Form>
      )}
    </Formik>
  );
}

export default ReviewForm;