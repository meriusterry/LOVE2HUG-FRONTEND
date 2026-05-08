import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Email, Lock, Person, Phone, LocationOn } from '@mui/icons-material';
import toast from 'react-hot-toast';
import api from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postal_code: ''
  });

  const from = location.state?.from || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;

      // ======================
      // LOGIN
      // ======================
      if (isLogin) {
        response = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });
      }

      // ======================
      // REGISTER
      // ======================
      else {
        response = await api.post('/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          province: formData.province,
          postal_code: formData.postal_code
        });
      }

      const data = response?.data;

      if (!data) {
        throw new Error('No response from server');
      }

      if (!data.token) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Save auth
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast.success(
        isLogin
          ? 'Login successful! Welcome back 🧸'
          : 'Account created successfully 🎉'
      );

      // Redirect logic
      if (data.user?.role === 'admin') {
        navigate('/admin');
      } else if (from === '/checkout') {
        navigate('/checkout');
      } else {
        navigate('/');
      }

    } catch (error) {
      console.error('AUTH ERROR:', error);

      const message =
        error.response?.data?.message ||
        error.message ||
        'Authentication failed';

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-pink-100 to-white">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
      >

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🧸</div>

          <h2 className="text-3xl font-bold text-gray-800">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>

          <p className="text-gray-600 mt-2">
            {isLogin
              ? 'Login to your account'
              : 'Join us today'}
          </p>

          {from === '/checkout' && (
            <p className="text-sm text-red-500 mt-2">
              Please login to continue checkout
            </p>
          )}
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME */}
          {!isLogin && (
            <div>
              <label className="text-sm">Full Name</label>
              <div className="relative">
                <Person className="absolute left-3 top-3 text-gray-400" />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 p-2 border rounded"
                  required
                />
              </div>
            </div>
          )}

          {/* EMAIL */}
          <div>
            <label className="text-sm">Email</label>
            <div className="relative">
              <Email className="absolute left-3 top-3 text-gray-400" />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 p-2 border rounded"
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" />
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 p-2 border rounded"
                required
              />
            </div>
          </div>

          {/* REGISTER FIELDS */}
          {!isLogin && (
            <>
              <input
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />

              <input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="p-2 border rounded"
                />

                <input
                  name="province"
                  placeholder="Province"
                  value={formData.province}
                  onChange={handleChange}
                  className="p-2 border rounded"
                />
              </div>
            </>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-500 text-white py-2 rounded"
          >
            {isLoading
              ? 'Loading...'
              : isLogin
                ? 'Login'
                : 'Sign Up'}
          </button>

          {/* SWITCH */}
          <p className="text-center text-sm mt-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}

            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-pink-600 ml-1"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>

        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;