import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ReviewSchema = Yup.object().shape({
  rating: Yup.number()
    .required('Rating is required')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  comment: Yup.string()
    .required('Comment is required')
    .min(10, 'Comment must be at least 10 characters')
});

function ReviewForm({ productId }) {
  return (
    <Formik
      initialValues={{ rating: '', comment: '' }}
      validationSchema={ReviewSchema}
      onSubmit={(values, { resetForm }) => {
        const newReview = {
          ...values,
          product_id: productId
        };
        fetch(`/api/products/${productId}/reviews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        })
        .then(response => response.json())
        .then(data => {
          console.log('Review submitted:', data);
          resetForm();
        })
        .catch(error => console.error('Error submitting review:', error));
      }}
    >
      <Form className="space-y-6">
        <div>
          <label htmlFor="rating" className="block text-sm font-semibold text-gray-700 mb-2">
            Rating:
          </label>
          <Field 
            name="rating" 
            type="number" 
            min="1" 
            max="5"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
            placeholder="Rate from 1 to 5"
          />
          <ErrorMessage name="rating" component="div" className="text-red-500 text-sm mt-1" />
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 mb-2">
            Comment:
          </label>
          <Field 
            name="comment" 
            as="textarea" 
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 resize-none"
            placeholder="Share your thoughts about this product..."
          />
          <ErrorMessage name="comment" component="div" className="text-red-500 text-sm mt-1" />
        </div>
        <button 
          type="submit"
          className="bg-primary-500 text-white font-bold py-3 px-8 rounded-full hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Submit Review
        </button>
      </Form>
    </Formik>
  );
}

export default ReviewForm;