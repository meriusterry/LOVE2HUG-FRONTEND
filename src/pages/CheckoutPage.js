import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'ZA',
    paymentMethod: 'card'
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      toast.error('Please login to continue with checkout');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    try {
      const userData = JSON.parse(userStr);
      setUser(userData);
      setIsLoggedIn(true);
      
      setFormData(prev => ({
        ...prev,
        firstName: userData.name?.split(' ')[0] || '',
        lastName: userData.name?.split(' ')[1] || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        province: userData.province || '',
        postalCode: userData.postal_code || ''
      }));
    } catch (error) {
      console.error('Error parsing user:', error);
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get('payment');
    
    if (paymentStatus === 'success') {
      toast.success('✅ Payment successful! Your order has been confirmed.', {
        duration: 5000,
        icon: '🎉'
      });
      navigate('/orders', { replace: true });
    } else if (paymentStatus === 'failed') {
      toast.error('❌ Payment failed. Please try again or use another payment method.', {
        duration: 5000
      });
    } else if (paymentStatus === 'cancelled') {
      toast.info('Payment was cancelled. You can try again when ready.', {
        duration: 4000
      });
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) {
      toast.error('Please login to place order');
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    try {
      const subtotal = cartTotal;
      const shipping = 100;
      const total = subtotal + shipping;

      const orderData = {
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: formData.address,
        city: formData.city,
        province: formData.province,
        postal_code: formData.postalCode,
        items: cartItems.map(item => ({
          product_id: item.id,
          product_name: item.name,
          product_price: parseFloat(item.price),
          quantity: item.quantity,
          size: item.size || '6ft',
          image_url: item.imageUrl || item.image_url || null
        })),
        subtotal: subtotal,
        shipping_cost: shipping,
        tax: 0,
        total: total,
        payment_method: formData.paymentMethod
      };

      const orderResponse = await api.post('/orders', orderData);
      
      if (orderResponse.data.success) {
        const order = orderResponse.data.order;
        
        if (formData.paymentMethod === 'card') {
          setShowRedirectModal(true);
          const payfastResponse = await api.post('/payfast/initiate', { orderId: order.id });
          
          if (payfastResponse.data.success) {
            clearCart();
            setTimeout(() => {
              window.location.href = payfastResponse.data.paymentUrl;
            }, 0);
          } else {
            setShowRedirectModal(false);
            throw new Error(payfastResponse.data.message || 'Payment initiation failed');
          }
        } else if (formData.paymentMethod === 'eft') {
          clearCart();
          toast.success('📧 Order received! Please check your email for bank details to complete the EFT payment.', {
            duration: 6000,
            icon: '🏦'
          });
          setTimeout(() => navigate('/orders'), 3000);
        } else if (formData.paymentMethod === 'cash') {
          clearCart();
          toast.success('🚚 Order placed! You will pay when your bears are delivered.', {
            duration: 5000,
            icon: '💰'
          });
          setTimeout(() => navigate('/orders'), 2500);
        }
      }
    } catch (error) {
      console.error('Order failed:', error);
      setShowRedirectModal(false);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to place order';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const RedirectModal = () => (
    <AnimatePresence>
      {showRedirectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl"
          >
            <div className="mb-6">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-12 h-12 text-primary-500 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Redirecting to PayFast</h2>
            <p className="text-gray-600 mb-6">Please do not close this page. We are redirecting you to complete your payment securely.</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2 }}
                className="bg-primary-500 h-2 rounded-full"
              />
            </div>
            <p className="text-sm text-gray-500">Please wait while we redirect you...</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-pink-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to complete your purchase</p>
          <button onClick={() => navigate('/login', { state: { from: '/checkout' } })} className="btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const subtotal = cartTotal;
  const shipping = 100;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <>
      <RedirectModal />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50 py-12">
        <div className="container mx-auto px-4">
          <motion.h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Checkout</motion.h1>

          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex justify-between items-center">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1 text-center">
                  <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center font-bold ${
                    step >= s ? 'bg-primary-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {s}
                  </div>
                  <p className={`text-sm ${step >= s ? 'text-primary-500 font-semibold' : 'text-gray-500'}`}>
                    {s === 1 ? 'Shipping' : s === 2 ? 'Payment' : 'Confirm'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping Information</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label><input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label><input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Email *</label><input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-gray-50" readOnly /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label><input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" /></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Address *</label><input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">City *</label><input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Province *</label><select name="province" required value={formData.province} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg"><option value="">Select Province</option><option value="Gauteng">Gauteng</option><option value="Western Cape">Western Cape</option><option value="KwaZulu-Natal">KwaZulu-Natal</option><option value="Eastern Cape">Eastern Cape</option><option value="Free State">Free State</option><option value="Mpumalanga">Mpumalanga</option><option value="Limpopo">Limpopo</option><option value="North West">North West</option><option value="Northern Cape">Northern Cape</option></select></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Postal Code *</label><input type="text" name="postalCode" required value={formData.postalCode} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Country</label><select name="country" value={formData.country} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg"><option value="ZA">South Africa</option></select></div>
                  </div>
                  <div className="mt-6 flex justify-end"><button onClick={() => setStep(2)} className="btn-primary">Continue to Payment →</button></div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Information</h2>
                  <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label><select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg"><option value="card">💳 Credit/Debit Card (PayFast)</option><option value="eft">🏦 Instant EFT</option><option value="cash">💰 Cash on Delivery</option></select></div>
                    {formData.paymentMethod === 'card' && (<div className="bg-yellow-50 p-4 rounded-lg"><p className="text-sm text-yellow-800">💳 You will be redirected to PayFast's secure payment page to complete your transaction.</p></div>)}
                    {formData.paymentMethod === 'eft' && (<div className="bg-blue-50 p-4 rounded-lg"><p className="text-sm text-blue-800">📧 After placing your order, you will receive an email with our bank details to complete the EFT payment.</p></div>)}
                    {formData.paymentMethod === 'cash' && (<div className="bg-green-50 p-4 rounded-lg"><p className="text-sm text-green-800">💰 Pay with cash when your bears are delivered. No payment needed now!</p></div>)}
                  </div>
                  <div className="mt-6 flex justify-between gap-4"><button onClick={() => setStep(1)} className="px-6 py-2 border rounded-lg hover:bg-gray-50">← Back</button><button onClick={() => setStep(3)} className="btn-primary">Review Order →</button></div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Review Your Order</h2>
                  <div className="space-y-6">
                    <div><h3 className="font-semibold text-gray-800 mb-3">Shipping Address</h3><p className="text-gray-600">{formData.firstName} {formData.lastName}<br />{formData.address}<br />{formData.city}, {formData.province} {formData.postalCode}<br />South Africa</p></div>
                    <div><h3 className="font-semibold text-gray-800 mb-3">Payment Method</h3><p className="text-gray-600">{formData.paymentMethod === 'card' ? '💳 Credit/Debit Card (PayFast)' : formData.paymentMethod === 'eft' ? '🏦 Instant EFT' : '💰 Cash on Delivery'}</p></div>
                    <div><h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>{cartItems.map((item) => (<div key={item.id} className="flex justify-between text-gray-600 py-2 border-b last:border-0"><span>{item.name} x {item.quantity}</span><span className="font-semibold">R{(parseFloat(item.price) * item.quantity).toFixed(2)}</span></div>))}</div>
                  </div>
                  <div className="mt-6 flex justify-between gap-4"><button onClick={() => setStep(2)} className="px-6 py-2 border rounded-lg hover:bg-gray-50">← Back</button><button onClick={handlePlaceOrder} disabled={isProcessing} className="btn-primary">{isProcessing ? 'Processing...' : 'Place Order'}</button></div>
                </motion.div>
              )}
            </div>

            <div className="lg:w-1/3">
              <motion.div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>R{subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-gray-600"><span>Delivery Fee</span><span>R{shipping.toFixed(2)}</span></div>
                  <div className="border-t pt-2 mt-2"><div className="flex justify-between font-bold text-gray-800"><span>Total</span><span className="text-primary-500 text-xl">R{total.toFixed(2)}</span></div></div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200"><div className="text-xs text-gray-500 space-y-1"><p>✓ Delivery fee: R100</p><p>✓ Prices include VAT</p><p>✓ 30-day return policy</p><p>✓ Secure payment processing</p></div></div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;