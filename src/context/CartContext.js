import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCart, syncCart } from '../services/api';
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
    
    // If user is logged in, load cart from backend
    const token = localStorage.getItem('token');
    if (token) {
      loadCartFromBackend();
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
      
      // If user is logged in, sync with backend (debounced)
      const token = localStorage.getItem('token');
      if (token && cartItems.length > 0) {
        const timeoutId = setTimeout(() => {
          syncCartWithBackend();
        }, 1000);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [cartItems, isLoading]);

  // Load cart from backend (for logged-in users)
  const loadCartFromBackend = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await getCart();
      if (response.data.success && response.data.items && response.data.items.length > 0) {
        // Merge backend cart with local cart
        const mergedItems = [...cartItems];
        
        response.data.items.forEach(backendItem => {
          const existingIndex = mergedItems.findIndex(item => item.id === backendItem.id);
          if (existingIndex !== -1) {
            // Use the higher quantity
            mergedItems[existingIndex].quantity = Math.max(
              mergedItems[existingIndex].quantity,
              backendItem.quantity
            );
          } else {
            mergedItems.push(backendItem);
          }
        });
        
        setCartItems(mergedItems);
        console.log('Cart loaded from backend');
      }
    } catch (error) {
      console.error('Error loading cart from backend:', error);
    }
  };

  // Sync cart with backend (for logged-in users)
  const syncCartWithBackend = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const cartData = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        size: item.size || '6ft'
      }));
      await syncCart(cartData);
      console.log('Cart synced with backend');
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  };

  const addToCart = (product, quantity = 1, size = '6ft') => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        toast.success(`Updated ${product.name} quantity in cart! 🧸`);
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + quantity, size: size }
            : item
        );
      }
      // Store all product details including image
      const newItem = { 
        ...product, 
        quantity: quantity,
        size: size,
        imageUrl: product.imageUrl || product.image_url || null,
        price: parseFloat(product.price)
      };
      toast.success(`${product.name} added to cart! 🧸`);
      return [...prev, newItem];
    });
  };

  const removeFromCart = (productId, productName) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    toast.success(`${productName || 'Item'} removed from cart`);
  };

  const updateQuantity = (productId, quantity, productName) => {
    if (quantity <= 0) {
      removeFromCart(productId, productName);
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
    toast.success('Cart cleared');
  };

  const getCartItemCount = () => {
    return cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  };

  const getCartSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
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
    getCartItemCount,
    getCartSubtotal,
    isLoading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};