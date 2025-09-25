import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserAuth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: '',
    security_question_1: '',
    security_answer_1: '',
    security_question_2: '',
    security_answer_2: ''
  });
  const [recoveryData, setRecoveryData] = useState({
    email: '',
    securityQuestions: [],
    answers: ['', ''],
    newPassword: '',
    resetToken: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const securityQuestions = [
    "What was the name of your first pet?",
    "What is your mother's maiden name?",
    "What city were you born in?",
    "What was the name of your elementary school?",
    "What is your favorite movie?",
    "What was your childhood nickname?"
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRecoveryChange = (e) => {
    setRecoveryData({ ...recoveryData, [e.target.name]: e.target.value });
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...recoveryData.answers];
    newAnswers[index] = value;
    setRecoveryData({ ...recoveryData, answers: newAnswers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
        navigate('/');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryData.email })
      });

      const data = await response.json();

      if (response.ok) {
        setRecoveryData({ ...recoveryData, securityQuestions: data.security_questions });
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySecurity = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: recoveryData.email,
          answers: recoveryData.answers
        })
      });

      const data = await response.json();

      if (response.ok) {
        setRecoveryData({ ...recoveryData, resetToken: data.reset_token });
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${recoveryData.resetToken}`
        },
        body: JSON.stringify({ new_password: recoveryData.newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Password reset successfully!');
        setIsRecovery(false);
        setRecoveryData({ email: '', securityQuestions: [], answers: ['', ''], newPassword: '', resetToken: '' });
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 sm:space-y-8">
          <div>
            <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
              Password Recovery
            </h2>
          </div>

          {!recoveryData.securityQuestions.length ? (
            <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
              <div>
                <label className="sr-only">Email address</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your email address"
                  value={recoveryData.email}
                  onChange={handleRecoveryChange}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Get Security Questions'}
              </button>
            </form>
          ) : !recoveryData.resetToken ? (
            <form className="mt-8 space-y-6" onSubmit={handleVerifySecurity}>
              <div className="space-y-4">
                {recoveryData.securityQuestions.map((question, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {question}
                    </label>
                    <input
                      type="text"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={recoveryData.answers[index]}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Answers'}
              </button>
            </form>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
              <div>
                <label className="sr-only">New Password</label>
                <input
                  name="newPassword"
                  type="password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter new password"
                  value={recoveryData.newPassword}
                  onChange={handleRecoveryChange}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          <div className="text-center">
            <button
              onClick={() => setIsRecovery(false)}
              className="text-indigo-600 hover:text-indigo-500"
            >
              Back to Login
            </button>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div>
          <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
        </div>
        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="sr-only">Email address</label>
              <input
                name="email"
                type="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="sr-only">Password</label>
              <input
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <input
                    name="name"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <input
                    name="phone"
                    type="tel"
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Phone Number (optional)"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <textarea
                    name="address"
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Address (optional)"
                    rows="2"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700">Security Questions (for account recovery)</h3>
                  <div>
                    <select
                      name="security_question_1"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                      value={formData.security_question_1}
                      onChange={handleInputChange}
                    >
                      <option value="">Select first security question</option>
                      {securityQuestions.map((q, i) => (
                        <option key={i} value={q}>{q}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      name="security_answer_1"
                      type="text"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Answer to first question"
                      value={formData.security_answer_1}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <select
                      name="security_question_2"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={formData.security_question_2}
                      onChange={handleInputChange}
                    >
                      <option value="">Select second security question</option>
                      {securityQuestions.filter(q => q !== formData.security_question_1).map((q, i) => (
                        <option key={i} value={q}>{q}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      name="security_answer_2"
                      type="text"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Answer to second question"
                      value={formData.security_answer_2}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Loading...' : (isLogin ? 'Sign in' : 'Sign up')}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 hover:text-indigo-500"
            >
              {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </button>
            {isLogin && (
              <button
                type="button"
                onClick={() => setIsRecovery(true)}
                className="text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </button>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserAuth;