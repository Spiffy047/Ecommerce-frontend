// src/components/AdminProductForm.jsx
import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ProductSchema = Yup.object().shape({
  name: Yup.string()
    .required('Product name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters')
    .matches(/^[a-zA-Z0-9\s-]+$/, 'Name can only contain letters, numbers, spaces, and hyphens'),
  description: Yup.string()
    .required('Description is required')
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  price: Yup.number()
    .required('Price is required')
    .typeError('Price must be a number')
    .positive('Price must be positive')
    .min(1, 'Price must be at least KSh 1')
    .max(9999999, 'Price must be less than KSh 10,000,000')
    .test('decimal-places', 'Price can have at most 2 decimal places', 
      value => value === undefined || /^\d+(\.\d{1,2})?$/.test(value.toString())),
  stock: Yup.number()
    .required('Stock quantity is required')
    .typeError('Stock must be a number')
    .integer('Stock must be a whole number')
    .min(0, 'Stock cannot be negative'),
  image_url: Yup.string()
    .required('Image URL is required')
    .test('url-or-path', 'Must be a valid URL or path', function(value) {
      if (!value) return false;
      // Allow URLs or local paths starting with /
      return /^https?:\/\/.+/.test(value) || /^\/images\/.+/.test(value);
    })
    .max(500, 'URL must be less than 500 characters')
});

function AdminProductForm({ onSubmit, initialValues = {}, isEditing = false, onCancel, token }) {
  const defaultValues = {
    name: '',
    description: '',
    price: '',
    stock: '',
    image_url: '',
    ...initialValues
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const url = isEditing ? `/api/products/${initialValues.id}` : '/api/products';
    const method = isEditing ? 'PUT' : 'POST';
    
    const payload = {
      name: values.name,
      description: values.description,
      price: parseFloat(values.price),
      stock: parseInt(values.stock),
      image_url: values.image_url
    };
    
    console.log('Submitting payload:', payload);
    
    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    })
      .then(response => {
        console.log('Response status:', response.status);
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          alert('Session expired. Please log in again.');
          window.location.reload();
          return;
        }
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.error || 'Network response was not ok');
          });
        }
        return response.json();
      })
      .then(data => {
        console.log(`Product ${isEditing ? 'updated' : 'added'} successfully:`, data);
        if (onSubmit) {
          onSubmit(data);
        }
        if (!isEditing) resetForm();
      })
      .catch(error => {
        console.error(`Error ${isEditing ? 'updating' : 'adding'} product:`, error);
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          localStorage.removeItem('adminToken');
          alert('Session expired. Please log in again.');
          window.location.reload();
        } else {
          alert(`Failed to ${isEditing ? 'update' : 'add'} product: ${error.message}`);
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg mx-auto mb-8">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
        {isEditing ? 'Edit Sports Item' : 'Add New Sports Item'}
      </h2>
      <Formik
        initialValues={defaultValues}
        enableReinitialize={true}
        validationSchema={ProductSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                Sports Item Name *
              </label>
              <Field 
                name="name" 
                type="text" 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-all duration-200"
                placeholder="e.g., Basketball Shoes"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                Description *
              </label>
              <Field 
                name="description" 
                as="textarea" 
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-all duration-200 resize-none"
                placeholder="A detailed description of the sports item..."
              />
              <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-gray-900 mb-2">
                  Price (KSh) *
                </label>
                <Field 
                  name="price" 
                  type="number" 
                  step="0.01"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-all duration-200"
                  placeholder="0.00"
                />
                <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-semibold text-gray-900 mb-2">
                  Stock Quantity *
                </label>
                <Field 
                  name="stock" 
                  type="number" 
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-all duration-200"
                  placeholder="0"
                />
                <ErrorMessage name="stock" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="image_url" className="block text-sm font-semibold text-gray-900 mb-2">
                  Image URL *
                </label>
                <Field 
                  name="image_url" 
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-all duration-200"
                  placeholder="https://example.com/image.jpg or /images/products/image.jpg"
                />
                <ErrorMessage name="image_url" component="div" className="text-red-500 text-sm mt-1" />
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white font-semibold py-4 px-8 rounded-lg hover:from-gray-800 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Sports Item' : 'Add Sports Item')}
              </button>
              {isEditing && onCancel && (
                <button 
                  type="button"
                  onClick={onCancel}
                  className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-4 px-8 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AdminProductForm;