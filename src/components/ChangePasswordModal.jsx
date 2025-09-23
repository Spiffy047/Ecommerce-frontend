import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const PasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password')
});

function ChangePasswordModal({ isOpen, onClose, token }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>
        
        <Formik
          initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
          validationSchema={PasswordSchema}
          onSubmit={(values, { setSubmitting, setStatus }) => {
            fetch('/api/auth/change-password', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword
              })
            })
            .then(response => {
              if (response.status === 401) {
                localStorage.removeItem('adminToken');
                alert('Session expired. Please log in again.');
                window.location.reload();
                return;
              }
              return response.json();
            })
            .then(data => {
              if (data.message) {
                setStatus({ type: 'success', message: data.message });
                setTimeout(() => onClose(), 2000);
              } else {
                setStatus({ type: 'error', message: data.error || 'Failed to change password' });
              }
            })
            .catch((error) => {
              if (error.message && error.message.includes('401')) {
                localStorage.removeItem('adminToken');
                alert('Session expired. Please log in again.');
                window.location.reload();
              } else {
                setStatus({ type: 'error', message: 'Failed to change password' });
              }
            })
            .finally(() => setSubmitting(false));
          }}
        >
          {({ isSubmitting, status }) => (
            <Form className="space-y-4">
              {status && (
                <div className={`p-3 rounded-lg text-sm ${
                  status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {status.message}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Current Password
                </label>
                <Field 
                  name="currentPassword" 
                  type="password"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                />
                <ErrorMessage name="currentPassword" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  New Password
                </label>
                <Field 
                  name="newPassword" 
                  type="password"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                />
                <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Confirm New Password
                </label>
                <Field 
                  name="confirmPassword" 
                  type="password"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
                />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="flex space-x-3 pt-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-gray-900 to-gray-700 text-white font-semibold py-3 rounded-lg hover:from-gray-800 hover:to-gray-600 transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? 'Changing...' : 'Change Password'}
                </button>
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default ChangePasswordModal;