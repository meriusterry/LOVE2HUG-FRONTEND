import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Visibility, LocalShipping, CheckCircle, Close, CreditCard, AccountBalance, AttachMoney } from '@mui/icons-material';
import api from '../services/api';
import toast from 'react-hot-toast';

const OrderDetailModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const getImageSrc = (item) => {
    if (item.imageUrl) return item.imageUrl;
    if (item.product_image) return `data:${item.image_type || 'image/jpeg'};base64,${item.product_image}`;
    if (item.image_url) return item.image_url;
    return 'https://via.placeholder.com/100x100?text=No+Image';
  };

  const getPaymentMethodIcon = (method) => {
    switch(method) {
      case 'card': return <CreditCard className="w-5 h-5 text-primary-500" />;
      case 'eft': return <AccountBalance className="w-5 h-5 text-primary-500" />;
      case 'cash': return <AttachMoney className="w-5 h-5 text-primary-500" />;
      default: return <CreditCard className="w-5 h-5 text-primary-500" />;
    }
  };

  const getPaymentMethodName = (method) => {
    switch(method) {
      case 'card': return 'Credit/Debit Card (PayFast)';
      case 'eft': return 'Instant EFT';
      case 'cash': return 'Cash on Delivery';
      default: return method || 'Not specified';
    }
  };

  const getStatusDisplay = (status, paymentStatus) => {
    if (paymentStatus === 'failed') {
      return 'Payment Failed';
    }
    switch(status) {
      case 'delivered': return 'Delivered';
      case 'shipped': return 'Shipped';
      case 'processing': return 'Processing';
      case 'order_received': return 'Order Received';
      case 'pending': return 'Pending';
      default: return status || 'Pending';
    }
  };

  const getStatusColor = (status, paymentStatus) => {
    if (paymentStatus === 'failed') {
      return 'bg-red-100 text-red-700';
    }
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'order_received': return 'bg-teal-100 text-teal-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
            <p className="text-gray-500">Order #{order.order_number}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <Close />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Order Status</p>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold mt-1 ${getStatusColor(order.status, order.payment_status)}`}>
                  {getStatusDisplay(order.status, order.payment_status)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-semibold text-gray-800">{new Date(order.created_at).toLocaleDateString('en-ZA')}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              {getPaymentMethodIcon(order.payment_method)}
              Payment Method
            </h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-700 font-medium">{getPaymentMethodName(order.payment_method)}</p>
              {order.payment_status === 'paid' && <p className="text-green-600 text-sm mt-1">✓ Payment completed</p>}
              {order.payment_status === 'failed' && <p className="text-red-600 text-sm mt-1">✗ Payment failed</p>}
              {order.payment_status === 'pending' && order.payment_method === 'eft' && <p className="text-yellow-600 text-sm mt-1">⏳ Awaiting payment confirmation</p>}
              {order.payment_status === 'pending' && order.payment_method === 'cash' && <p className="text-blue-600 text-sm mt-1">💰 Payment on delivery</p>}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <LocalShipping className="w-5 h-5 text-primary-500" />
              Shipping Address
            </h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-700">{order.shipping_address}<br />{order.city}, {order.province} {order.postal_code}<br />South Africa</p>
              {order.customer_phone && <p className="text-gray-600 mt-2">📞 {order.customer_phone}</p>}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Order Items ({order.items?.length || 0})</h3>
            <div className="space-y-3">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-3 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <img src={getImageSrc(item)} alt={item.product_name} className="w-16 h-16 object-cover rounded-lg border border-gray-200" onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100?text=No+Image'; }} />
                      <div>
                        <p className="font-medium text-gray-800">{item.product_name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity} | Size: {item.size || '6ft'}</p>
                        <p className="text-sm text-primary-500">R{parseFloat(item.product_price).toFixed(2)} each</p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-800">R{(parseFloat(item.product_price) * item.quantity).toFixed(2)}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No items found for this order</p>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-semibold">R{parseFloat(order.subtotal).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Delivery Fee</span><span className="font-semibold">R{parseFloat(order.shipping_cost).toFixed(2)}</span></div>
              <div className="flex justify-between pt-2 border-t mt-2"><span className="text-xl font-bold text-gray-800">Total</span><span className="text-2xl font-bold text-primary-500">R{parseFloat(order.total).toFixed(2)}</span></div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end sticky bottom-0 bg-white">
          <button onClick={onClose} className="btn-primary">Close</button>
        </div>
      </motion.div>
    </div>
  );
};

const OrdersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Check payment status when returning from PayFast
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get('payment');
    const orderNumber = params.get('order_number');
    
    if (paymentStatus === 'processing' && orderNumber) {
      const processingToast = toast.loading('⏳ Processing your payment... Please wait.', {
        duration: 30000,
      });
      
      const checkPaymentStatus = setInterval(async () => {
        try {
          const response = await api.get(`/orders/payment-status/${orderNumber}`);
          if (response.data.success) {
            if (response.data.paymentStatus === 'paid') {
              clearInterval(checkPaymentStatus);
              toast.dismiss(processingToast);
              toast.success('✅ Payment successful! Your order has been confirmed.', {
                duration: 5000,
                icon: '🎉'
              });
              fetchOrders();
            } else if (response.data.paymentStatus === 'failed') {
              clearInterval(checkPaymentStatus);
              toast.dismiss(processingToast);
              toast.error('❌ Payment failed. Please try again.', {
                duration: 5000
              });
              fetchOrders();
            }
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
        }
      }, 3000);
      
      setTimeout(() => {
        clearInterval(checkPaymentStatus);
        toast.dismiss(processingToast);
      }, 60000);
    } else if (paymentStatus === 'success') {
      toast.success('✅ Payment successful! Your order has been confirmed.', {
        duration: 5000,
        icon: '🎉'
      });
      fetchOrders();
    } else if (paymentStatus === 'failed') {
      toast.error('❌ Payment failed. Please try again.', {
        duration: 5000
      });
    } else if (paymentStatus === 'cancelled') {
      toast.info('Payment was cancelled.', {
        duration: 4000
      });
    }
  }, [location]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders');
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const getImageSrc = (item) => {
    if (item.imageUrl) return item.imageUrl;
    if (item.product_image) return `data:${item.image_type || 'image/jpeg'};base64,${item.product_image}`;
    if (item.image_url) return item.image_url;
    return 'https://via.placeholder.com/50x50?text=No+Image';
  };

  const getPaymentMethodIcon = (method) => {
    switch(method) {
      case 'card': return <CreditCard className="w-4 h-4 text-gray-500" />;
      case 'eft': return <AccountBalance className="w-4 h-4 text-gray-500" />;
      case 'cash': return <AttachMoney className="w-4 h-4 text-gray-500" />;
      default: return <CreditCard className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPaymentMethodName = (method) => {
    switch(method) {
      case 'card': return 'Card';
      case 'eft': return 'EFT';
      case 'cash': return 'Cash on Delivery';
      default: return method || 'Not specified';
    }
  };

  const getStatusColor = (status, paymentStatus) => {
    if (paymentStatus === 'failed') {
      return 'bg-red-100 text-red-700';
    }
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'order_received': return 'bg-teal-100 text-teal-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusDisplay = (status, paymentStatus) => {
    if (paymentStatus === 'failed') {
      return 'Payment Failed';
    }
    switch(status) {
      case 'delivered': return 'Delivered';
      case 'shipped': return 'Shipped';
      case 'processing': return 'Processing';
      case 'order_received': return 'Order Received';
      case 'pending': return 'Pending';
      default: return status || 'Pending';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <LocalShipping className="w-4 h-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🧸</div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
          <button onClick={() => navigate('/shop')} className="btn-primary">Start Shopping</button>
        </div>
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
          My Orders ({orders.length})
        </motion.h1>
        
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div 
              key={order.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.1 }} 
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-wrap justify-between items-start mb-4 gap-4">
                  <div><p className="text-sm text-gray-500">Order Number</p><p className="font-semibold text-gray-800">{order.order_number}</p></div>
                  <div><p className="text-sm text-gray-500">Order Date</p><p className="text-gray-800">{new Date(order.created_at).toLocaleDateString('en-ZA')}</p></div>
                  <div><p className="text-sm text-gray-500">Total Amount</p><p className="text-xl font-bold text-primary-500">R{parseFloat(order.total).toFixed(2)}</p></div>
                  <div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status, order.payment_status)}`}>
                      {getStatusIcon(order.status)}
                      {getStatusDisplay(order.status, order.payment_status)}
                    </span>
                  </div>
                </div>
                
                <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
                  {getPaymentMethodIcon(order.payment_method)}
                  <span>Payment: {getPaymentMethodName(order.payment_method)}</span>
                  {order.payment_status === 'paid' && <span className="text-green-600 text-xs ml-2">(Paid)</span>}
                  {order.payment_status === 'failed' && <span className="text-red-600 text-xs ml-2">(Failed)</span>}
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">{order.items?.length || 0} item(s) in this order</p>
                      <div className="flex gap-2 mt-2">
                        {order.items && order.items.slice(0, 3).map((item, idx) => (
                          <img key={idx} src={getImageSrc(item)} alt={item.product_name} className="w-10 h-10 rounded-lg object-cover border border-gray-200" onError={(e) => { e.target.src = 'https://via.placeholder.com/50x50?text=No+Image'; }} />
                        ))}
                        {order.items && order.items.length > 3 && (<div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">+{order.items.length - 3}</div>)}
                      </div>
                    </div>
                    <button onClick={() => handleViewDetails(order)} className="text-primary-500 hover:text-primary-600 font-semibold inline-flex items-center gap-1 transition-colors">
                      <Visibility className="w-4 h-4" /> View Details
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <OrderDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} order={selectedOrder} />
    </div>
  );
};

export default OrdersPage;