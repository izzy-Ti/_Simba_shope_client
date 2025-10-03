import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProductsProvider } from './contexts/ProductsContext';
import { OrdersProvider } from './contexts/OrdersContext';
import { ReviewsProvider } from './contexts/ReviewsContext';
import { SellerProvider } from './contexts/SellerContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import SellerDashboard from './pages/SellerDashboard';
import Payment from './pages/Payment';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductsProvider>
          <OrdersProvider>
            <ReviewsProvider>
              <SellerProvider>
                <CartProvider>
                  <WishlistProvider>
                    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                      <Header />
                      
                      <main style={{ flex: 1, backgroundColor: '#f8fafc' }}>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/products" element={<Products />} />
                          <Route path="/products/:id" element={<ProductDetail />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/orders" element={<Orders />} />
                          <Route path="/wishlist" element={<Wishlist />} />
                          <Route path="/seller" element={<SellerDashboard />} />
                          <Route path="/payment" element={<Payment />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                      
                      <Footer />
                    </div>
                  </WishlistProvider>
                </CartProvider>
              </SellerProvider>
            </ReviewsProvider>
          </OrdersProvider>
        </ProductsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;