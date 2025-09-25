import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { API_BASE_URL } from '../config';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required')
});

function AdminLogin({ onLogin }) {
  const [error, setError] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-600 mt-2">Access SportZone Admin Panel</p>
        </div>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={(values, { setSubmitting }) => {
            setError('');
            fetch(`${API_BASE_URL}/api/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(values)
            })
            .then(response => response.json())
            .then(data => {
              if (data.access_token) {
                localStorage.setItem('adminToken', data.access_token);
                const isFirstLogin = values.email === 'admin@sportzone.com' && values.password === 'Admin@123';
                onLogin(data.access_token, isFirstLogin);
              } else {
                setError(data.error || 'Login failed');
              }
            })
            .catch(() => setError('Login failed'))
            .finally(() => setSubmitting(false));
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email
                </label>
                <Field 
                  name="email" 
                  type="email"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                  placeholder="admin@sportzone.com"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Password
                </label>
                <Field 
                  name="password" 
                  type="password"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white font-semibold py-3 rounded-lg hover:from-gray-800 hover:to-gray-600 transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default AdminLogin;