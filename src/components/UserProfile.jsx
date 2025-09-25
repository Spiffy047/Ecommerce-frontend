import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [orders, setOrders] = useState([]);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile();
      fetchOrders();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (err) {
      setError('Failed to load profile');
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/user/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (err) {
      setError('Failed to load orders');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">My Account</h1>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-4 sm:mb-6">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
          {[
            { id: 'profile', name: 'Profile', icon: '👤' },
            { id: 'orders', name: 'Order History', icon: '📦' },
            { id: 'password', name: 'Change Password', icon: '🔒' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-1 sm:mr-2">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.name}</span>
              <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Messages */}
      {message && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Profile Information</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm sm:text-base"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profile.phone || ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                value={profile.address || ''}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Order History</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500 text-sm sm:text-base">No orders found.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 space-y-2 sm:space-y-0">
                    <div>
                      <h3 className="font-medium text-sm sm:text-base">Order #{order.id}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">{formatDate(order.order_date)}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-medium text-sm sm:text-base">KSh {order.total_amount?.toLocaleString()}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                        {item.image_url && (
                          <img 
                            src={item.image_url} 
                            alt={item.product_name}
                            className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base truncate">{item.product_name}</p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Qty: {item.quantity} × KSh {item.price?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="bg-white shadow rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserProfile;