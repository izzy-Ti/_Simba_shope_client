import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { productsAPI, apiUtils } from '../services/api';
import { useAuth } from './AuthContext';

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const loadProducts = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsAPI.getAllProducts(filters);
      
      if (response.success) {
        setProducts(response.products || []);
      } else {
        setError(response.message || 'Failed to load products');
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      setError(errorData.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCartItems = useCallback(async () => {
    try {
      // Load cart from localStorage for now
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(cart);
    } catch (error) {
      console.error('Failed to load cart items:', error);
    }
  }, []);

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Load cart items when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCartItems();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, loadCartItems]);

  const getProductById = useCallback(async (productId) => {
    try {
      setLoading(true);
      const response = await productsAPI.getProductById(productId);
      
      if (response.success) {
        return { success: true, product: response.product };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      return { success: false, message: errorData.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const filterProducts = useCallback(async (filters) => {
    try {
      setLoading(true);
      const response = await productsAPI.filterProducts(filters);
      
      if (response.success) {
        setProducts(response.products || []);
        return { success: true, products: response.products };
      } else {
        setError(response.message || 'Failed to filter products');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      setError(errorData.message);
      return { success: false, message: errorData.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (productId) => {
    if (!isAuthenticated) {
      return { success: false, message: 'Please login to add items to cart' };
    }

    try {
      // For now, use a mock cart system since backend auth is not working
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = existingCart.find(item => item.product_id === productId);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        // Get product details
        const productResponse = await productsAPI.getProductById(productId);
        if (productResponse.success) {
          existingCart.push({
            id: Date.now() + Math.random(), // Generate unique ID
            product_id: productId,
            name: productResponse.product.name,
            price: productResponse.product.price,
            image: productResponse.product.images?.[0] || null,
            quantity: 1,
            stock: productResponse.product.stock || 0
          });
        } else {
          return { success: false, message: 'Product not found' };
        }
      }
      
      localStorage.setItem('cart', JSON.stringify(existingCart));
      setCartItems(existingCart);
      
      return { success: true, message: 'Product added to cart' };
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      return { success: false, message: errorData.message };
    }
  }, [isAuthenticated]);

  const removeFromCart = async (cartId) => {
    if (!isAuthenticated) {
      return { success: false, message: 'Please login to manage cart' };
    }

    try {
      // Remove from localStorage cart
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const updatedCart = existingCart.filter(item => item.id !== cartId);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      
      return { success: true, message: 'Item removed from cart' };
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      return { success: false, message: errorData.message };
    }
  };

  const createProduct = async (productData) => {
    if (!isAuthenticated) {
      return { success: false, message: 'Please login to create products' };
    }

    try {
      setLoading(true);
      const response = await productsAPI.createProduct(productData);
      
      if (response.success) {
        // Reload products
        await loadProducts();
        return { success: true, message: response.message, product: response.product };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      return { success: false, message: errorData.message };
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, productData) => {
    if (!isAuthenticated) {
      return { success: false, message: 'Please login to update products' };
    }

    try {
      setLoading(true);
      const response = await productsAPI.updateProduct(productId, productData);
      
      if (response.success) {
        // Reload products
        await loadProducts();
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      return { success: false, message: errorData.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!isAuthenticated) {
      return { success: false, message: 'Please login to delete products' };
    }

    try {
      setLoading(true);
      const response = await productsAPI.deleteProduct(productId);
      
      if (response.success) {
        // Reload products
        await loadProducts();
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      return { success: false, message: errorData.message };
    } finally {
      setLoading(false);
    }
  };

  // Calculate cart totals
  const getCartTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    };
  };

  const value = {
    products,
    cartItems,
    loading,
    error,
    loadProducts,
    getProductById,
    filterProducts,
    addToCart,
    removeFromCart,
    createProduct,
    updateProduct,
    deleteProduct,
    loadCartItems,
    getCartTotals,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
