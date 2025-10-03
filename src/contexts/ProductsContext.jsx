import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { productsAPI, apiUtils } from '../services/api';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading products with filters:', filters);
      
      const response = await productsAPI.getAllProducts(filters);
      console.log('Products API response:', response);
      
      if (response.success) {
        setProducts(response.products || []);
        console.log('Products loaded successfully:', response.products?.length || 0);
      } else {
        const errorMsg = response.message || 'Failed to load products';
        console.error('Products API error:', errorMsg);
        setError(errorMsg);
      }
    } catch (error) {
      const errorData = apiUtils.handleError(error);
      console.error('Products API exception:', errorData);
      setError(errorData.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

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


  const createProduct = async (productData) => {

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

  const value = {
    products,
    loading,
    error,
    loadProducts,
    getProductById,
    filterProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
