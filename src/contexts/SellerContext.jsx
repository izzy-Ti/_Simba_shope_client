import React, { createContext, useContext, useState, useEffect } from 'react';
import { sellerAPI, apiUtils } from '../services/api';
import { useAuth } from './AuthContext';

const SellerContext = createContext();

export const useSeller = () => {
  const context = useContext(SellerContext);
  if (!context) {
    throw new Error('useSeller must be used within a SellerProvider');
  }
  return context;
};

export const SellerProvider = ({ children }) => {
  const [sellerProducts, setSellerProducts] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Safely get auth context
  let isAuthenticated = false;
  try {
    const authContext = useAuth();
    isAuthenticated = authContext.isAuthenticated;
  } catch (error) {
    // Auth context not available yet
    console.log('Auth context not ready yet');
  }

  // Load seller data when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadSellerData();
    } else {
      setSellerProducts([]);
      setSellerOrders([]);
    }
  }, [isAuthenticated]);

  const loadSellerData = async () => {
    await Promise.all([
      loadSellerProducts(),
      loadSellerOrders()
    ]);
  };

  const loadSellerProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sellerAPI.getSellerProducts();
      
      if (response.success) {
        setSellerProducts(response.products || []);
      } else {
        setError(response.message || 'Failed to load seller products');
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      setError(errorData.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSellerOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sellerAPI.getSellerOrders();
      
      if (response.success) {
        setSellerOrders(response.orders || []);
      } else {
        setError(response.message || 'Failed to load seller orders');
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      setError(errorData.message);
    } finally {
      setLoading(false);
    }
  };

  const getSellerStats = () => {
    const totalProducts = sellerProducts.length;
    const totalOrders = sellerOrders.length;
    const totalRevenue = sellerOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const completedOrders = sellerOrders.filter(order => order.status === 'completed').length;
    const pendingOrders = sellerOrders.filter(order => order.status === 'pending').length;

    return {
      totalProducts,
      totalOrders,
      totalRevenue,
      completedOrders,
      pendingOrders,
      completionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0
    };
  };

  const getRecentOrders = (limit = 5) => {
    return sellerOrders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  };

  const getTopProducts = (limit = 5) => {
    // This would need to be calculated based on sales data
    // For now, return the most recent products
    return sellerProducts
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  };

  const value = {
    sellerProducts,
    sellerOrders,
    loading,
    error,
    loadSellerProducts,
    loadSellerOrders,
    loadSellerData,
    getSellerStats,
    getRecentOrders,
    getTopProducts,
  };

  return (
    <SellerContext.Provider value={value}>
      {children}
    </SellerContext.Provider>
  );
};
