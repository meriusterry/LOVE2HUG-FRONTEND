import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import { Navigate } from "react-router-dom";

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AccountPage from './pages/AccountPage';
import OrdersPage from './pages/OrdersPage';
import AdminRoute from './components/admin/AdminRoute';
import RedirectPage from './pages/RedirectPage';

import PayFastReturn from './pages/PayFastReturn';
import AdminMessages from './pages/admin/AdminMessages';





function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <AnimatePresence mode="wait">
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                     // Add this route inside your Routes
<Route path="/redirect" element={<RedirectPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/orders" element={<OrdersPage />} />
           
                
<Route path="/payfast/return" element={<PayFastReturn />} />
<Route path="/payfast/cancel" element={<Navigate to="/cart" />} />


                
                {/* Admin Routes - Protected */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                // Add this route inside the admin protected routes
<Route path="/admin/messages" element={<AdminRoute><AdminMessages /></AdminRoute>} />
              </Routes>
            </main>
          </AnimatePresence>
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ECDC4',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;