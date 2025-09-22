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
        fetch('/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newReview)
        })
        .then(response => response.json())
        .then(data => {
          console.log('Review submitted:', data);
          resetForm();
        })
        .catch(error => console.error('Error submitting review:', error));
      }}
    >
      <Form>
        <div>
          <label htmlFor="rating">Rating:</label>
          <Field name="rating" type="number" />
          <ErrorMessage name="rating" component="div" />
        </div>
        <div>
          <label htmlFor="comment">Comment:</label>
          <Field name="comment" as="textarea" />
          <ErrorMessage name="comment" component="div" />
        </div>
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
}

export default ReviewForm;