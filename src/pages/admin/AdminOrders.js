import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Visibility, LocalShipping, CheckCircle, Cancel, Update, CreditCard, AccountBalance, AttachMoney } from '@mui/icons-material';
import api from '../../services/api';
import toast from 'react-hot-toast';

const OrderDetailModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const getPaymentMethodIcon = (method) => {
    switch(method) {
      case 'card':
        return <CreditCard className="w-5 h-5 text-primary-500" />;
      case 'eft':
        return <AccountBalance className="w-5 h-5 text-primary-500" />;
      case 'cash':
        return <AttachMoney className="w-5 h-5 text-primary-500" />;
      default:
        return <CreditCard className="w-5 h-5 text-primary-500" />;
    }
  };

  const getPaymentMethodName = (method) => {
    switch(method) {
      case 'card':
        return 'Credit/Debit Card (PayFast)';
      case 'eft':
        return 'Instant EFT';
      case 'cash':
        return 'Cash on Delivery';
      default:
        return method || 'Not specified';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch(status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
          <p className="text-gray-500">Order Number: {order.order_number}</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Customer Name</p>
              <p className="font-semibold text-gray-800">{order.customer_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold text-gray-800">{order.customer_email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-semibold text-gray-800">{order.customer_phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-semibold text-gray-800">{new Date(order.created_at).toLocaleString('en-ZA')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Status</p>
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Status</p>
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                {order.payment_status?.charAt(0).toUpperCase() + order.payment_status?.slice(1) || 'Pending'}
              </span>
            </div>
          </div>
          
          {/* Payment Method */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              {getPaymentMethodIcon(order.payment_method)}
              Payment Method
            </h3>
            <p className="text-gray-600">{getPaymentMethodName(order.payment_method)}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Shipping Address</h3>
            <p className="text-gray-600">
              {order.shipping_address}<br />
              {order.city}, {order.province} {order.postal_code}<br />
              South Africa
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
            <div className="space-y-2">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium text-gray-800">{item.product_name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity} | Size: {item.size || '6ft'}</p>
                  </div>
                  <p className="font-semibold text-gray-800">R{(parseFloat(item.product_price) * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">R{parseFloat(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-semibold">R{parseFloat(order.shipping_cost).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-2 pt-2 border-t">
              <span className="text-xl font-bold text-gray-800">Total</span>
              <span className="text-2xl font-bold text-primary-500">R{parseFloat(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button onClick={onClose} className="btn-primary">Close</button>
        </div>
      </motion.div>
    </div>
  );
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

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

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status: newStatus.toLowerCase() });
      if (response.data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders(); // Refresh orders
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusColor = (paymentStatus) => {
    switch(paymentStatus) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch(method) {
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      case 'eft':
        return <AccountBalance className="w-4 h-4" />;
      case 'cash':
        return <AttachMoney className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const getStatusDisplay = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered': return 'Delivered';
      case 'shipped': return 'Shipped';
      case 'processing': return 'Processing';
      case 'pending': return 'Pending';
      default: return status || 'Pending';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status?.toLowerCase() === filter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || order.payment_status === statusFilter;
    return matchesFilter && matchesStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    revenue: orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0),
    paidOrders: orders.filter(o => o.payment_status === 'paid').length,
    pendingPayment: orders.filter(o => o.payment_status === 'pending').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🧸</div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Order Management</h1>
          <p className="text-gray-600">Manage and track customer orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-8 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <p className="text-gray-500 text-xs">Total Orders</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <p className="text-gray-500 text-xs">Pending</p>
            <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <p className="text-gray-500 text-xs">Processing</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.processing}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <p className="text-gray-500 text-xs">Shipped</p>
            <p className="text-2xl font-bold text-blue-600">{stats.shipped}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <p className="text-gray-500 text-xs">Delivered</p>
            <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <p className="text-gray-500 text-xs">Paid</p>
            <p className="text-2xl font-bold text-green-600">{stats.paidOrders}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <p className="text-gray-500 text-xs">Pending Payment</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingPayment}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <p className="text-gray-500 text-xs">Revenue</p>
            <p className="text-2xl font-bold text-primary-500">R{stats.revenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-wrap gap-3 mb-4">
              <button 
                onClick={() => setFilter('all')} 
                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                All Orders ({stats.total})
              </button>
              <button 
                onClick={() => setFilter('pending')} 
                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'pending' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Pending ({stats.pending})
              </button>
              <button 
                onClick={() => setFilter('processing')} 
                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'processing' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Processing ({stats.processing})
              </button>
              <button 
                onClick={() => setFilter('shipped')} 
                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'shipped' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Shipped ({stats.shipped})
              </button>
              <button 
                onClick={() => setFilter('delivered')} 
                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'delivered' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Delivered ({stats.delivered})
              </button>
            </div>
            
            {/* Payment Status Filter */}
            <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-100">
              <span className="text-sm text-gray-500 font-medium">Payment Status:</span>
              <button 
                onClick={() => setStatusFilter('all')} 
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${statusFilter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                All
              </button>
              <button 
                onClick={() => setStatusFilter('paid')} 
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${statusFilter === 'paid' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Paid
              </button>
              <button 
                onClick={() => setStatusFilter('pending')} 
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${statusFilter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Pending
              </button>
            </div>
          </div>
          
          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.order_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.customer_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('en-ZA')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.item_count || order.items?.length || 0} items
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        R{parseFloat(order.total).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {getPaymentMethodIcon(order.payment_method)}
                          <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                            {order.payment_status?.charAt(0).toUpperCase() + order.payment_status?.slice(1) || 'Pending'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          disabled={updatingStatus}
                          className={`px-3 py-1 text-sm rounded-full border-0 font-semibold cursor-pointer ${getStatusColor(order.status)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button 
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDetailOpen(true);
                          }}
                          className="text-primary-500 hover:text-primary-600 transition-colors"
                          title="View Details"
                        >
                          <Visibility className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <OrderDetailModal 
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default AdminOrders;