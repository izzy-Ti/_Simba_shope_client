import React, { createContext, useContext, useState, useEffect } from 'react';
import { ordersAPI, apiUtils } from '../services/api';
import { useAuth } from './AuthContext';

const OrdersContext = createContext();

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Load orders when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadOrderHistory();
    } else {
      setOrders([]);
    }
  }, [isAuthenticated]);

  const loadOrderHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ordersAPI.getOrderHistory();
      
      if (response.success) {
        setOrders(response.orders || []);
      } else {
        setError(response.message || 'Failed to load orders');
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      setError(errorData.message);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (productId, orderData) => {
    if (!isAuthenticated) {
      return { success: false, message: 'Please login to create orders' };
    }

    try {
      setLoading(true);
      const response = await ordersAPI.createOrder(productId, orderData);
      
      if (response.success) {
        // Reload orders
        await loadOrderHistory();
        return { success: true, message: response.message, order: response.order };
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

  const updateOrder = async (orderId, updateData) => {
    if (!isAuthenticated) {
      return { success: false, message: 'Please login to update orders' };
    }

    try {
      setLoading(true);
      const response = await ordersAPI.updateOrder(orderId, updateData);
      
      if (response.success) {
        // Reload orders
        await loadOrderHistory();
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

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  const value = {
    orders,
    loading,
    error,
    loadOrderHistory,
    createOrder,
    updateOrder,
    getOrderById,
    getOrdersByStatus,
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
};
