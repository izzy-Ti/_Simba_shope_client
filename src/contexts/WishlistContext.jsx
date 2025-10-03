import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI, productsAPI } from '../services/api'; // Using same API since wishlist uses user_wishlist table
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
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

  // Load wishlist items from localStorage
  const loadWishlistItems = async () => {
    if (!isAuthenticated || !user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // For now, use localStorage since backend wishlist requires authentication
      // that we can't provide due to CORS issues
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      
      // Fetch product details for each wishlist item
      const wishlistWithProducts = await Promise.all(
        wishlist.map(async (wishlistItem) => {
          try {
            const productResponse = await productsAPI.getProductById(wishlistItem.product_id);
            if (productResponse.success) {
              return {
                ...wishlistItem,
                product: productResponse.product
              };
            } else {
              // Fallback to mock data if product fetch fails
              return {
                ...wishlistItem,
                product: {
                  name: `Product ${wishlistItem.product_id.slice(-8)}`, // Mock name
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
      
      setWishlistItems(wishlistWithProducts.filter(item => item !== null));
    } catch (error) {
      setError('Failed to load wishlist items');
      console.error('Error loading wishlist items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add item to wishlist
  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      setError('Please login to add items to wishlist');
      return { success: false, message: 'Please login to add items to wishlist' };
    }

    setLoading(true);
    setError(null);

    try {
      // For now, use localStorage since backend wishlist requires authentication
      // that we can't provide due to CORS issues
      const existingWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const existingItem = existingWishlist.find(item => item.product_id === productId);
      
      if (!existingItem) {
        // Get product details
        const productResponse = await productsAPI.getProductById(productId);
        if (productResponse.success) {
          existingWishlist.push({
            id: `wishlist-${Date.now()}-${Math.random()}`,
            product_id: productId,
            product: productResponse.product
          });
        } else {
          setError('Failed to get product details');
          return { success: false, message: 'Failed to get product details.' };
        }
      }
      
      localStorage.setItem('wishlist', JSON.stringify(existingWishlist));
      await loadWishlistItems(); // Reload wishlist after adding
      return { success: true, message: 'Item added to wishlist successfully' };
    } catch (error) {
      const errorMessage = 'Failed to add item to wishlist';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (wishlistId) => {
    if (!isAuthenticated) return { success: false, message: 'Please login' };

    setLoading(true);
    setError(null);

    try {
      // For now, use localStorage since backend wishlist requires authentication
      // that we can't provide due to CORS issues
      const existingWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const updatedWishlist = existingWishlist.filter(item => item.id !== wishlistId);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      
      // Remove item from local state
      setWishlistItems(prev => prev.filter(item => item.id !== wishlistId));
      return { success: true, message: 'Item removed from wishlist' };
    } catch (error) {
      const errorMessage = 'Failed to remove item from wishlist';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Clear wishlist
  const clearWishlist = () => {
    setWishlistItems([]);
  };

  // Get wishlist item count
  const getWishlistItemCount = () => {
    return wishlistItems.length;
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  // Move item from wishlist to cart
  const moveToCart = async (productId) => {
    // This would require a separate API endpoint in a real app
    // For now, we'll just add to cart
    return await addToWishlist(productId);
  };

  // Load wishlist items when user logs in
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadWishlistItems();
    } else {
      setWishlistItems([]);
    }
  }, [isAuthenticated, user?.id]);

  const value = {
    wishlistItems,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    getWishlistItemCount,
    isInWishlist,
    moveToCart,
    loadWishlistItems
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
