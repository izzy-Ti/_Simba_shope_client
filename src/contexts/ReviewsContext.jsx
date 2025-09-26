import React, { createContext, useContext, useState, useCallback } from 'react';
import { reviewsAPI, apiUtils } from '../services/api';
import { useAuth } from './AuthContext';

const ReviewsContext = createContext();

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};

export const ReviewsProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const addReview = useCallback(async (productId, reviewData) => {
    if (!isAuthenticated) {
      return { success: false, message: 'Please login to add reviews' };
    }

    try {
      setLoading(true);
      setError(null);
      const response = await reviewsAPI.addReview(productId, reviewData);
      
      if (response.success) {
        return { success: true, message: response.message, review: response.review };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      setError(errorData.message);
      return { success: false, message: errorData.message };
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const getProductRating = useCallback(async (productId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reviewsAPI.getProductRating(productId);
      
      if (response.success) {
        return { success: true, rating: response.rating };
      } else {
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

  const getProductReviews = useCallback(async (productId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reviewsAPI.getProductReviews(productId);
      
      if (response.success) {
        return { success: true, reviews: response.reviews };
      } else {
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

  const value = {
    loading,
    error,
    addReview,
    getProductRating,
    getProductReviews,
  };

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  );
};
