import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI, productsAPI } from '../services/api';
import { useAuth } from './AuthContext';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Safely get auth context
  let isAuthenticated = false;
  let user = null;
  try {
    const authContext = useAuth();
    isAuthenticated = authContext.isAuthenticated;
    user = authContext.user;
  } catch (error) {
    // Auth context not available yet
    console.log('Auth context not ready yet');
  }

  // Load cart items from backend
  const loadCartItems = async () => {
    if (!isAuthenticated || !user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // For now, use localStorage since backend cart requires authentication
      // that we can't provide due to CORS issues
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Fetch product details for each cart item
      const cartWithProducts = await Promise.all(
        cart.map(async (cartItem) => {
          try {
            const productResponse = await productsAPI.getProductById(cartItem.product_id);
            if (productResponse.success) {
              return {
                ...cartItem,
                product: productResponse.product
              };
            } else {
              // Fallback to mock data if product fetch fails
              return {
                ...cartItem,
                product: {
                  quantity: 1, // Default quantity since backend doesn't store quantity in wishlist
                  name: `Product ${cartItem.product_id.slice(-8)}`, // Mock name
                  price: 99.99, // Mock price
                  image: '/api/placeholder/300/200', // Mock image
                  stock: 10 // Mock stock
                }
              };
            }
          } catch (error) {
            console.error('Error fetching product details:', error);
            return null;
          }
        })
      );
      
      setCartItems(cartWithProducts.filter(item => item !== null));
    } catch (error) {
      setError('Failed to load cart items');
      console.error('Error loading cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId) => {
    if (!isAuthenticated) {
      setError('Please login to add items to cart');
      return { success: false, message: 'Please login to add items to cart' };
    }

    setLoading(true);
    setError(null);

    try {
      // For now, use localStorage since backend cart requires authentication
      // that we can't provide due to CORS issues
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = existingCart.find(item => item.product_id === productId);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        // Get product details
        const productResponse = await productsAPI.getProductById(productId);
        if (productResponse.success) {
          // Only store essential cart data
          existingCart.push({
            id: `cart-${Date.now()}-${Math.random()}`,
            product_id: productId,
            quantity: 1,
            // Store minimal product data to avoid bloat
            product: {
              id: productResponse.product.id,
              name: productResponse.product.name,
              price: productResponse.product.price,
              images: productResponse.product.images
            }
          });
        } else {
          setError('Failed to get product details');
          return { success: false, message: 'Failed to get product details.' };
        }
      }
      
      localStorage.setItem('cart', JSON.stringify(existingCart));
      await loadCartItems(); // Reload cart after adding
      return { success: true, message: 'Item added to cart successfully' };
    } catch (error) {
      const errorMessage = 'Failed to add item to cart';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartId) => {
    if (!isAuthenticated) return { success: false, message: 'Please login' };

    setLoading(true);
    setError(null);

    try {
      // For now, use localStorage since backend cart requires authentication
      // that we can't provide due to CORS issues
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const updatedCart = existingCart.filter(item => item.id !== cartId);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      // Remove item from local state
      setCartItems(prev => prev.filter(item => item.id !== cartId));
      return { success: true, message: 'Item removed from cart' };
    } catch (error) {
      const errorMessage = 'Failed to remove item from cart';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity (for future enhancement)
  const updateQuantity = (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === cartId ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Get cart totals
  const getCartTotals = () => {
    const subtotal = cartItems.reduce((total, item) => {
      const price = item.product?.price || item.price || 0;
      const quantity = item.quantity || 1;
      return total + (parseFloat(price) * quantity);
    }, 0);
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };
  };

  // Get cart item count
  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Check if item is in cart
  const isInCart = (productId) => {
    return cartItems.some(item => item.product_id === productId);
  };

  // Load cart items when user logs in
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadCartItems();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, user?.id]);

  const value = {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotals,
    getCartItemCount,
    isInCart,
    loadCartItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
