import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AccessTime, Lock, CreditCard, Security, ArrowForward } from '@mui/icons-material';
import toast from 'react-hot-toast';

const RedirectPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(5);
  const [redirectUrl, setRedirectUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the payment URL from location state
    const paymentUrl = location.state?.paymentUrl;
    
    if (!paymentUrl) {
      toast.error('No payment URL found. Please try again.');
      navigate('/cart');
      return;
    }
    
    setRedirectUrl(paymentUrl);
    setLoading(false);
  }, [location, navigate]);

  useEffect(() => {
    if (redirectUrl && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (redirectUrl && countdown === 0) {
      window.location.href = redirectUrl;
    }
  }, [countdown, redirectUrl]);

  const handleRedirectNow = () => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing your secure payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-block p-3 bg-primary-100 rounded-full mb-4">
              <CreditCard className="w-12 h-12 text-primary-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Redirecting to PayFast
            </h1>
            <p className="text-gray-600">
              Please wait while we securely redirect you to complete your payment
            </p>
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Warning Banner */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6 rounded-lg">
              <div className="flex items-center gap-3">
                <AccessTime className="w-6 h-6 text-red-500" />
                <div>
                  <p className="font-semibold text-red-700">⚠️ Important: Do not close this page!</p>
                  <p className="text-sm text-red-600">
                    Please wait while we redirect you to the secure payment gateway.
                    Closing this page will cancel your transaction.
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="p-6 text-center">
              {/* Animated Icon */}
              <div className="mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-pink-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Lock className="w-10 h-10 text-primary-500" />
                  </motion.div>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="mb-6">
                <div className="text-5xl font-bold text-primary-500 mb-2">{countdown}</div>
                <p className="text-gray-500">seconds until redirect</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full"
                />
              </div>

              {/* Loading Dots */}
              <div className="flex justify-center gap-2 mb-6">
                <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>

              {/* Manual Redirect Button */}
              <button
                onClick={handleRedirectNow}
                className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-semibold transition-colors"
              >
                Click here if you're not redirected automatically
                <ArrowForward className="w-4 h-4" />
              </button>
            </div>

            {/* Security Info */}
            <div className="bg-gray-50 p-6 border-t border-gray-200">
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-green-500" />
                  <span>256-bit SSL Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Security className="w-4 h-4 text-green-500" />
                  <span>PCI Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-green-500" />
                  <span>All Major Cards Accepted</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer Note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 8.4 }}
            className="text-center text-xs text-gray-400 mt-6"
          >
            You will be redirected to PayFast's secure payment page. Your transaction is protected by industry-standard encryption.
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default RedirectPage;