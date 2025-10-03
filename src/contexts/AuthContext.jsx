import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, apiUtils } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = apiUtils.getStoredUser();
        if (storedUser && apiUtils.isAuthenticated()) {
          // For now, just restore the stored user without backend verification
          // This ensures persistence across refreshes
          setUser(storedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        apiUtils.clearUser();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      
      if (response.success) {
        // Get user data using the backend API
        const email = credentials.email;
        localStorage.setItem('userEmail', email);
        
        // For now, we'll use a temporary userId since login doesn't return it
        // In a real implementation, the backend should return userId in login response
        const tempUserId = `temp-${Date.now()}`;
        localStorage.setItem('userId', tempUserId);
        
        try {
          // Try to get user data from backend
          const userDataResponse = await authAPI.getUserData();
          
          if (userDataResponse.success) {
            const userData = userDataResponse.userData;
            
            // Store user data and token
            apiUtils.storeUser(userData, 'cookie_auth');
            localStorage.setItem('userId', userData.id || tempUserId);
            
            setUser(userData);
            setIsAuthenticated(true);
            
            return { success: true, message: 'Login successful' };
          } else {
            // If backend user data fails, create basic user data
            const basicUserData = {
              id: tempUserId,
              email: email,
              name: email.split('@')[0],
              username: email.split('@')[0],
              phone: '',
              IsAccVerified: false
            };
            
            apiUtils.storeUser(basicUserData, 'cookie_auth');
            setUser(basicUserData);
            setIsAuthenticated(true);
            
            return { success: true, message: 'Login successful' };
          }
        } catch (userDataError) {
          // If getting user data fails, create basic user data
          const basicUserData = {
            id: tempUserId,
            email: email,
            name: email.split('@')[0],
            username: email.split('@')[0],
            phone: '',
            IsAccVerified: false
          };
          
          apiUtils.storeUser(basicUserData, 'cookie_auth');
          setUser(basicUserData);
          setIsAuthenticated(true);
          
          return { success: true, message: 'Login successful' };
        }
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

  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Ensure all required fields are included
      const registrationData = {
        email: userData.email,
        password: userData.password,
        name: userData.name || `${userData.firstName} ${userData.lastName}`,
        firstName: userData.firstName || userData.name?.split(' ')[0] || '',
        lastName: userData.lastName || userData.name?.split(' ').slice(1).join(' ') || '',
        username: userData.username || userData.email.split('@')[0],
        phone: userData.phone || '',
        address: userData.address || ''
      };
      
      const response = await authAPI.register(registrationData);
      
      if (response.success) {
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

  const logout = () => {
    apiUtils.clearUser();
    setUser(null);
    setIsAuthenticated(false);
  };

  const sendVerifyOTP = async () => {
    try {
      const response = await authAPI.sendVerifyOTP();
      return { success: response.success, message: response.message };
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      return { success: false, message: errorData.message };
    }
  };

  const verifyOTP = async (otpData) => {
    try {
      const response = await authAPI.verifyOTP(otpData);
      return { success: response.success, message: response.message };
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      return { success: false, message: errorData.message };
    }
  };

  const sendResetOTP = async (email) => {
    try {
      const response = await authAPI.sendResetOTP(email);
      return { success: response.success, message: response.message };
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      return { success: false, message: errorData.message };
    }
  };

  const resetPassword = async (resetData) => {
    try {
      const response = await authAPI.resetPassword(resetData);
      return { success: response.success, message: response.message };
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      return { success: false, message: errorData.message };
    }
  };

  const getUserData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        return { success: false, message: 'User not logged in' };
      }
      
      const response = await authAPI.getUserData();
      if (response.success) {
        setUser(response.userData);
        return { success: true, user: response.userData };
      }
      return { success: false, message: response.message };
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      return { success: false, message: errorData.message };
    }
  };

  const addAddress = async (addressData) => {
    try {
      const response = await authAPI.addAddress(addressData);
      return { success: response.success, message: response.message };
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      return { success: false, message: errorData.message };
    }
  };

  const getAddress = async (addressId) => {
    try {
      const response = await authAPI.getAddress(addressId);
      return { success: response.success, data: response.data };
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      return { success: false, message: errorData.message };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    sendVerifyOTP,
    verifyOTP,
    sendResetOTP,
    resetPassword,
    getUserData,
    addAddress,
    getAddress,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};