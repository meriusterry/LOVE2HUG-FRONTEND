import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  AttachMoney, 
  Inventory,
  Category,
  Visibility
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StatCard = ({ title, value, icon, color, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm uppercase tracking-wide">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        {trend && (
          <p className="text-green-500 text-sm mt-2">+{trend}% from last month</p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

const RecentOrdersTable = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      const response = await api.get('/orders');
      if (response.data.success) {
        setOrders(response.data.orders.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'order_received': return 'bg-teal-100 text-teal-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusDisplay = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered': return 'Delivered';
      case 'order_received': return 'Order Received';
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'pending': return 'Pending';
      default: return status || 'Pending';
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                No orders found
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.order_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {order.customer_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleDateString('en-ZA')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  R{parseFloat(order.total).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusDisplay(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button 
                    onClick={() => navigate('/admin/orders')}
                    className="text-primary-500 hover:text-primary-600"
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
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStockItems: 0,
    pendingOrders: 0,
    orderReceived: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        api.get('/products'),
        api.get('/orders')
      ]);
      
      const productsData = productsRes.data.products || [];
      const ordersData = ordersRes.data.orders || [];
      
      setProducts(productsData);
      
      setStats({
        totalRevenue: ordersData.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0),
        totalOrders: ordersData.length,
        totalProducts: productsData.length,
        lowStockItems: productsData.filter(p => p.stock < 10 && p.status === 'active').length,
        pendingOrders: ordersData.filter(o => o.status === 'pending').length,
        orderReceived: ordersData.filter(o => o.status === 'order_received').length,
        processingOrders: ordersData.filter(o => o.status === 'processing').length,
        shippedOrders: ordersData.filter(o => o.status === 'shipped').length,
        deliveredOrders: ordersData.filter(o => o.status === 'delivered').length
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getProductImageUrl = (product) => {
    if (product.imageUrl) return product.imageUrl;
    if (product.image_url) return product.image_url;
    if (product.product_image) return `data:${product.image_type || 'image/jpeg'};base64,${product.product_image}`;
    return 'https://via.placeholder.com/50x50?text=No+Image';
  };

  const statCards = [
    { title: 'Total Revenue', value: `R${stats.totalRevenue.toFixed(2)}`, icon: <AttachMoney className="w-6 h-6 text-white" />, color: 'bg-gradient-to-r from-primary-500 to-primary-600' },
    { title: 'Total Orders', value: stats.totalOrders.toString(), icon: <ShoppingBag className="w-6 h-6 text-white" />, color: 'bg-gradient-to-r from-secondary-500 to-secondary-600' },
    { title: 'Total Products', value: stats.totalProducts.toString(), icon: <Inventory className="w-6 h-6 text-white" />, color: 'bg-gradient-to-r from-blue-500 to-blue-600' },
    { title: 'Low Stock Items', value: stats.lowStockItems.toString(), icon: <Category className="w-6 h-6 text-white" />, color: 'bg-gradient-to-r from-orange-500 to-orange-600' },
  ];

  const topProducts = [...products]
    .sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <p className="text-gray-500 text-sm">Order Received</p>
            <p className="text-2xl font-bold text-teal-600">{stats.orderReceived}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <p className="text-gray-500 text-sm">Processing</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.processingOrders}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <p className="text-gray-500 text-sm">Shipped</p>
            <p className="text-2xl font-bold text-blue-600">{stats.shippedOrders}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center">
            <p className="text-gray-500 text-sm">Delivered</p>
            <p className="text-2xl font-bold text-green-600">{stats.deliveredOrders}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/admin/products')}
                className="w-full text-left px-4 py-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
              >
                ➕ Add New Product
              </button>
              <button 
                onClick={() => navigate('/admin/orders')}
                className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                📦 Manage Orders
              </button>
              <button 
                onClick={() => navigate('/admin/messages')}
                className="w-full text-left px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
              >
                📧 View Contact Messages
              </button>
              <button 
                onClick={async () => {
                  try {
                    const [productsRes, ordersRes] = await Promise.all([
                      api.get('/products'),
                      api.get('/orders')
                    ]);
                    const report = {
                      date: new Date().toISOString(),
                      totalProducts: productsRes.data.products.length,
                      totalOrders: ordersRes.data.orders.length,
                      totalRevenue: ordersRes.data.orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0),
                      lowStock: productsRes.data.products.filter(p => p.stock < 10).length
                    };
                    console.log('Report generated:', report);
                    toast.success('Report generated! Check console for data.');
                  } catch (error) {
                    toast.error('Failed to generate report');
                  }
                }}
                className="w-full text-left px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                📊 Generate Report
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Top Products</h3>
            <div className="space-y-4">
              {topProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No products found</p>
              ) : (
                topProducts.map((product) => (
                  <div key={product.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img 
                        src={getProductImageUrl(product)} 
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                        }}
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.reviews_count || 0} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-500">R{parseFloat(product.price).toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Recent Orders</h3>
              <button 
                onClick={() => navigate('/admin/orders')}
                className="btn-primary text-sm"
              >
                View All Orders
              </button>
            </div>
          </div>
          <RecentOrdersTable />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;