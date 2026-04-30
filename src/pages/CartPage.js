import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, Add, Remove, ShoppingBag } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const applyPromoCode = () => {
    if (promoCode === 'HUG20') {
      setDiscount(cartTotal * 0.2);
      toast.success('Promo code applied! 20% discount');
    } else if (promoCode === 'LOVE10') {
      setDiscount(cartTotal * 0.1);
      toast.success('Promo code applied! 10% discount');
    } else {
      toast.error('Invalid promo code');
    }
  };

  const handleProceedToCheckout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to continue with checkout');
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  const getImageUrl = (item) => {
    if (item.imageUrl) return item.imageUrl;
    if (item.image_url) return item.image_url;
    if (item.image) return item.image;
    return 'https://via.placeholder.com/200x200?text=No+Image';
  };

  const subtotal = cartTotal;
  const discountAmount = discount;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const shipping = 100;
  const total = subtotalAfterDiscount + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <ShoppingBag className="w-32 h-32 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any bears to your cart yet.</p>
          <button onClick={() => navigate('/shop')} className="btn-primary">
            Start Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50 py-12">
      <div className="container mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-800 mb-8"
        >
          Shopping Cart ({cartItems.length} items)
        </motion.h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 bg-gradient-to-r from-gray-50 to-pink-50 px-6 py-4 font-semibold text-gray-600">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Total</div>
              </div>
              
              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center">
                      <div className="md:col-span-6 flex gap-4">
                        <img 
                          src={getImageUrl(item)} 
                          alt={item.name} 
                          className="w-20 h-20 object-cover rounded-lg shadow-md"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/200x200?text=No+Image'; }}
                        />
                        <div>
                          <h3 className="font-semibold text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">Size: {item.size || '6ft'}</p>
                          <button 
                            onClick={() => {
                              removeFromCart(item.id);
                              toast.success(`${item.name} removed from cart`);
                            }}
                            className="text-red-500 text-sm hover:text-red-600 mt-2 inline-flex items-center gap-1 transition-colors"
                          >
                            <Delete className="w-4 h-4" /> Remove
                          </button>
                        </div>
                      </div>
                      <div className="md:col-span-2 text-left md:text-center">
                        <span className="md:hidden font-semibold text-gray-600 mr-2">Price:</span>
                        <span className="text-gray-800">R{parseFloat(item.price).toFixed(2)}</span>
                      </div>
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-2 justify-start md:justify-center">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Remove className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Add className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="md:col-span-2 font-semibold text-primary-500">
                        <span className="md:hidden font-semibold text-gray-600 mr-2">Total:</span>
                        R{(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <div className="p-6 bg-gray-50 flex justify-between">
                <button 
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-600 font-semibold transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Try: HUG20 (20% off) or LOVE10 (10% off)</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">R{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-R{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold">R{shipping.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-xl font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-primary-500">R{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleProceedToCheckout}
                className="w-full btn-primary mb-3"
              >
                Proceed to Checkout
              </button>
              
              <button 
                onClick={() => navigate('/shop')}
                className="w-full text-primary-500 hover:text-primary-600 font-semibold transition-colors"
              >
                Continue Shopping
              </button>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-center gap-4 text-sm text-gray-500">
                  <span>✓ Secure Payment</span>
                  <span>✓ Free Returns</span>
                  <span>✓ 24/7 Support</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;