import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  ShoppingCart, 
  Favorite, 
  Person, 
  Menu as MenuIcon,
  Close,
  Login as LoginIcon,
  AppRegistration as RegisterIcon
} from '@mui/icons-material';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userStr && token) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAdmin(userData.role === 'admin');
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing user:', error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
      setIsAdmin(false);
    }
  }, [location.pathname]); // Re-check when route changes

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  // Check if a path is active
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Close all menus and navigate
  const handleNavigation = (path, closeMenu = true) => {
    if (closeMenu) {
      setIsUserMenuOpen(false);
      setIsMenuOpen(false);
    }
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    toast.success('Logged out successfully');
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    setUser(null);
    setIsAdmin(false);
    setIsLoggedIn(false);
    navigate('/');
  };

  // Get user's display name (first name or email)
  const getUserDisplayName = () => {
    if (!user) return '';
    if (user.name) {
      const firstName = user.name.split(' ')[0];
      return firstName;
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo with Teddy Bear Image */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img 
              src="/images/lovelogo.jpeg"
              alt="Teddy Bear Logo"
              className="w-10 h-10 rounded-full object-cover shadow-md"
              onError={(e) => {
                e.target.src = 'https://cdn-icons-png.flaticon.com/512/744/744922.png';
              }}
            />
            <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
              Love2Cuddle 🧸
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`font-medium transition-colors duration-300 ${
                  isActive(item.path)
                    ? 'text-primary-500 border-b-2 border-primary-500'
                    : 'text-gray-700 hover:text-primary-500'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Icons and User Info */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => handleNavigation('/favorites')}
              className="p-2 hover:bg-pink-50 rounded-full transition-colors duration-300"
            >
              <Favorite className="text-gray-600 hover:text-primary-500" />
            </button>
            
            {/* Cart with count */}
            <button 
              onClick={() => handleNavigation('/cart')}
              className="p-2 hover:bg-pink-50 rounded-full transition-colors duration-300 relative"
            >
              <ShoppingCart className="text-gray-600 hover:text-primary-500" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Logged-in User Name Display (Desktop) */}
            {isLoggedIn && (
              <div className="hidden md:flex items-center gap-2 ml-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {getUserDisplayName().charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Hi, {getUserDisplayName()}!
                </span>
              </div>
            )}

            {/* User Menu Button */}
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-2 hover:bg-pink-50 rounded-full transition-colors duration-300"
              >
                <Person className="text-gray-600 hover:text-primary-500" />
              </button>
              
              {isUserMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50"
                >
                  {!isLoggedIn ? (
                    <>
                      {/* Login/Signup options for non-logged in users */}
                      <div className="px-4 py-2 bg-gradient-to-r from-primary-50 to-pink-50">
                        <p className="text-sm text-gray-600 mb-2">Welcome to Love2Cuddle!</p>
                        <p className="text-xs text-gray-500">Sign in to access your account</p>
                      </div>
                      
                      <Link 
                        to="/login" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-pink-50 transition-colors"
                      >
                        <LoginIcon className="w-4 h-4" />
                        Login
                      </Link>
                      <Link 
                        to="/login" 
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          sessionStorage.setItem('preferSignup', 'true');
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-pink-50 transition-colors"
                      >
                        <RegisterIcon className="w-4 h-4" />
                        Sign Up
                      </Link>
                      
                      <hr className="my-1 border-gray-100" />
                      <div className="px-4 py-2 text-xs text-gray-400">
                        New customer? 
                        <button 
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            sessionStorage.setItem('preferSignup', 'true');
                            navigate('/login');
                          }} 
                          className="text-primary-500 hover:text-primary-600 ml-1"
                        >
                          Create account
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* User info header */}
                      <div className="px-4 py-2 bg-gradient-to-r from-primary-50 to-pink-50">
                        <p className="text-sm font-semibold text-gray-800">Welcome back!</p>
                        <p className="text-xs text-gray-500 truncate">{user?.name || user?.email}</p>
                      </div>
                      
                      {/* User Account Links */}
                      <Link 
                        to="/account" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className={`block px-4 py-2 transition-colors ${
                          isActive('/account')
                            ? 'bg-pink-50 text-primary-500 font-semibold'
                            : 'text-gray-700 hover:bg-pink-50'
                        }`}
                      >
                        👤 My Account
                      </Link>
                      <Link 
                        to="/orders" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className={`block px-4 py-2 transition-colors ${
                          isActive('/orders')
                            ? 'bg-pink-50 text-primary-500 font-semibold'
                            : 'text-gray-700 hover:bg-pink-50'
                        }`}
                      >
                        📦 My Orders
                      </Link>
                      
                      {/* Only show Admin Section if user is admin */}
                      {isAdmin && (
                        <>
                          <hr className="my-1 border-gray-100" />
                          <div className="px-4 py-1 text-xs text-gray-400 uppercase font-semibold">Admin Panel</div>
                          <Link 
                            to="/admin" 
                            onClick={() => setIsUserMenuOpen(false)}
                            className={`block px-4 py-2 transition-colors ${
                              isActive('/admin') && location.pathname === '/admin'
                                ? 'bg-pink-50 text-primary-500 font-semibold'
                                : 'text-gray-700 hover:bg-pink-50'
                            }`}
                          >
                            📊 Dashboard
                          </Link>
                          <Link 
                            to="/admin/products" 
                            onClick={() => setIsUserMenuOpen(false)}
                            className={`block px-4 py-2 transition-colors ${
                              isActive('/admin/products')
                                ? 'bg-pink-50 text-primary-500 font-semibold'
                                : 'text-gray-700 hover:bg-pink-50'
                            }`}
                          >
                            🧸 Manage Products
                          </Link>
                          <Link 
                            to="/admin/orders" 
                            onClick={() => setIsUserMenuOpen(false)}
                            className={`block px-4 py-2 transition-colors ${
                              isActive('/admin/orders')
                                ? 'bg-pink-50 text-primary-500 font-semibold'
                                : 'text-gray-700 hover:bg-pink-50'
                            }`}
                          >
                            📋 Manage Orders
                          </Link>
                        </>
                      )}
                      
                      <hr className="my-1 border-gray-100" />
                      
                      {/* Logout */}
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        🚪 Logout
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-pink-50 rounded-full transition-colors duration-300"
            >
              {isMenuOpen ? <Close /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t border-gray-100 max-h-[80vh] overflow-y-auto"
          >
            {/* Logo in mobile menu */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <img 
                src="/images/teddy-bear-logo.png"
                alt="Teddy Bear Logo"
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://cdn-icons-png.flaticon.com/512/744/744922.png';
                }}
              />
              <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                Love2Cuddle
              </span>
            </div>
            
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-primary-500 border-l-4 border-primary-500 pl-3'
                    : 'text-gray-700 hover:text-primary-500'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            <hr className="my-2 border-gray-100" />
            
            {!isLoggedIn ? (
              <>
                {/* Login/Signup options for mobile */}
                <div className="bg-gradient-to-r from-primary-50 to-pink-50 p-3 rounded-lg mb-2">
                  <p className="text-sm font-semibold text-gray-800">Welcome to Love2Cuddle!</p>
                  <p className="text-xs text-gray-500">Sign in to access your account</p>
                </div>
                <Link 
                  to="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-3 text-gray-700 hover:text-primary-500 transition-colors"
                >
                  <LoginIcon className="w-5 h-5" />
                  Login
                </Link>
                <Link 
                  to="/login" 
                  onClick={() => {
                    setIsMenuOpen(false);
                    sessionStorage.setItem('preferSignup', 'true');
                  }}
                  className="flex items-center gap-2 py-3 text-gray-700 hover:text-primary-500 transition-colors"
                >
                  <RegisterIcon className="w-5 h-5" />
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <div className="bg-gradient-to-r from-primary-50 to-pink-50 p-3 rounded-lg mb-2">
                  <p className="text-sm font-semibold text-gray-800">Welcome back, {getUserDisplayName()}!</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                
                <Link 
                  to="/account" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-3 transition-colors ${
                    isActive('/account')
                      ? 'text-primary-500 border-l-4 border-primary-500 pl-3'
                      : 'text-gray-700 hover:text-primary-500'
                  }`}
                >
                  👤 My Account
                </Link>
                <Link 
                  to="/orders" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-3 transition-colors ${
                    isActive('/orders')
                      ? 'text-primary-500 border-l-4 border-primary-500 pl-3'
                      : 'text-gray-700 hover:text-primary-500'
                  }`}
                >
                  📦 My Orders
                </Link>
                
                {/* Only show Admin Section in mobile menu if user is admin */}
                {isAdmin && (
                  <>
                    <div className="text-xs text-gray-400 uppercase font-semibold mt-4 mb-2">Admin Panel</div>
                    <Link 
                      to="/admin" 
                      onClick={() => setIsMenuOpen(false)}
                      className={`block py-3 transition-colors ${
                        isActive('/admin') && location.pathname === '/admin'
                          ? 'text-primary-500 border-l-4 border-primary-500 pl-3'
                          : 'text-gray-700 hover:text-primary-500'
                      }`}
                    >
                      📊 Dashboard
                    </Link>
                    <Link 
                      to="/admin/products" 
                      onClick={() => setIsMenuOpen(false)}
                      className={`block py-3 transition-colors ${
                        isActive('/admin/products')
                          ? 'text-primary-500 border-l-4 border-primary-500 pl-3'
                          : 'text-gray-700 hover:text-primary-500'
                      }`}
                    >
                      🧸 Manage Products
                    </Link>
                    <Link 
                      to="/admin/orders" 
                      onClick={() => setIsMenuOpen(false)}
                      className={`block py-3 transition-colors ${
                        isActive('/admin/orders')
                          ? 'text-primary-500 border-l-4 border-primary-500 pl-3'
                          : 'text-gray-700 hover:text-primary-500'
                      }`}
                    >
                      📋 Manage Orders
                    </Link>
                  </>
                )}
              </>
            )}
            
            <hr className="my-2 border-gray-100" />
            
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="block w-full text-left py-3 text-red-600 hover:bg-red-50 transition-colors"
              >
                🚪 Logout
              </button>
            ) : (
              <div className="text-center py-2 text-xs text-gray-500">
                New customer?{' '}
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    sessionStorage.setItem('preferSignup', 'true');
                    navigate('/login');
                  }}
                  className="text-primary-500 hover:text-primary-600 font-semibold"
                >
                  Create account
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;