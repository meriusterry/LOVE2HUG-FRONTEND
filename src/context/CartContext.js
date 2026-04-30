import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          setCartItems(parsedCart);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        setCartItems([]);
      }
    }
    setIsLoading(false);
  }, []);

  // Update counts and save to localStorage whenever cart changes
  useEffect(() => {
    if (!isLoading) {
      const count = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
      const total = cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
      setCartCount(count);
      setCartTotal(total);
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoading]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + quantity }
            : item
        );
      }
      // Store all product details including image
      const newItem = { 
        ...product, 
        quantity: quantity,
        imageUrl: product.imageUrl || product.image_url || null,
        price: parseFloat(product.price)
      };
      return [...prev, newItem];
    });
   
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  // Sync cart with backend (for logged-in users)
  const syncCartWithBackend = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const cartData = {
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          size: item.size || '6ft'
        }))
      };
      await api.post('/cart/sync', cartData);
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  };

  // Load cart from backend (for logged-in users)
  const loadCartFromBackend = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await api.get('/cart');
      if (response.data.success && response.data.items.length > 0) {
        setCartItems(response.data.items);
      }
    } catch (error) {
      console.error('Error loading cart from backend:', error);
    }
  };

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    syncCartWithBackend,
    loadCartFromBackend,
    isLoading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};