import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: false, // Disable credentials to avoid CORS issues
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  // User registration
  register: async (userData) => {
    const response = await api.post('/user/signup', userData);
    return response.data;
  },

  // User login
  login: async (credentials) => {
    const response = await api.post('/user/login', credentials);
    return response.data;
  },

  // Send verification OTP
  sendVerifyOTP: async () => {
    const response = await api.post('/user/sendVerifyOTP');
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (otpData) => {
    const response = await api.post('/user/verifyOTP', otpData);
    return response.data;
  },

  // Check if user is authenticated
  isAuth: async () => {
    const response = await api.post('/user/isAuth');
    return response.data;
  },

  // Send reset password OTP
  sendResetOTP: async (email) => {
    const response = await api.post('/user/sendResetOTP', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (resetData) => {
    const response = await api.post('/user/resetPassword', resetData);
    return response.data;
  },

  // Get user data
  getUserData: async () => {
    // For now, return mock data since backend doesn't have a proper /me endpoint
    // In a real app, you'd need to create this endpoint in the backend
    return {
      success: true,
      user: {
        id: 'temp_user_id',
        name: 'User',
        email: 'user@example.com',
        username: 'user'
      }
    };
  },

  // Add address
  addAddress: async (addressData) => {
    const response = await api.post('/user/addAdress', addressData);
    return response.data;
  },

  // Get address by ID
  getAddress: async (addressId) => {
    const response = await api.get(`/user/seeAddress/${addressId}`);
    return response.data;
  },
};

// Products API
export const productsAPI = {
  // Get all products
  getAllProducts: async (params = {}) => {
    const response = await api.get('/product/getAll', { params });
    return response.data;
  },

  // Get product by ID
  getProductById: async (productId) => {
    const response = await api.get(`/product/getById/${productId}`);
    return response.data;
  },

  // Create product (seller)
  createProduct: async (productData) => {
    const formData = new FormData();
    
    // Add product fields
    Object.keys(productData).forEach(key => {
      if (key === 'images' && Array.isArray(productData[key])) {
        productData[key].forEach((image, index) => {
          formData.append('images', image);
        });
      } else if (key !== 'images') {
        formData.append(key, productData[key]);
      }
    });

    const response = await api.post('/product/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update product
  updateProduct: async (productId, productData) => {
    const response = await api.post(`/product/updateProduct/${productId}`, productData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (productId) => {
    const response = await api.delete(`/product/deleteById/${productId}`);
    return response.data;
  },

  // Filter products
  filterProducts: async (filters = {}) => {
    const response = await api.get('/product/filterProduct', { params: filters });
    return response.data;
  },

  // Add to cart
  addToCart: async (productId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      return { success: false, message: 'User not logged in' };
    }
    const response = await api.post(`/product/cart/${productId}`, { userId });
    return response.data;
  },

  // Get cart items
  getCartItems: async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      return { success: false, message: 'User not logged in' };
    }
    const response = await api.post('/product/getcart', { userId });
    return response.data;
  },

  // Remove from cart
  removeFromCart: async (cartId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      return { success: false, message: 'User not logged in' };
    }
    const response = await api.delete(`/product/deletecart/${cartId}`, { data: { userId } });
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  // Create order
  createOrder: async (productId, orderData) => {
    const response = await api.post(`/order/createOrder/${productId}`, orderData);
    return response.data;
  },

  // Update order
  updateOrder: async (orderId, updateData) => {
    const response = await api.post(`/order/UpdateOrder/${orderId}`, updateData);
    return response.data;
  },

  // Get order history
  getOrderHistory: async () => {
    const response = await api.get('/order/orderHistory');
    return response.data;
  },
};

// Reviews API
export const reviewsAPI = {
  // Add review
  addReview: async (productId, reviewData) => {
    const response = await api.post(`/review/addReview/${productId}`, reviewData);
    return response.data;
  },

  // Get product rating
  getProductRating: async (productId) => {
    const response = await api.get(`/review/productRating/${productId}`);
    return response.data;
  },

  // Get product reviews
  getProductReviews: async (productId) => {
    const response = await api.get(`/review/productReviews/${productId}`);
    return response.data;
  },
};

// Seller API
export const sellerAPI = {
  // Get seller products
  getSellerProducts: async () => {
    const response = await api.get('/sellerboard/seeProducts');
    return response.data;
  },

  // Get seller orders
  getSellerOrders: async () => {
    const response = await api.get('/sellerboard/seeOrders');
    return response.data;
  },
};

// Utility functions
export const apiUtils = {
  // Handle API errors
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'Network error. Please check your connection.',
        status: 0,
        data: null,
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0,
        data: null,
      };
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!(token && token !== 'undefined' && token !== 'null');
  },

  // Get stored user data
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    if (!user || user === 'undefined' || user === 'null') {
      return null;
    }
    try {
      return JSON.parse(user);
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      localStorage.removeItem('user');
      return null;
    }
  },

  // Store user data
  storeUser: (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  },

  // Clear user data
  clearUser: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },
};

export default api;