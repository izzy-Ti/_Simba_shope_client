import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const profileDropdownRef = useRef(null);

  const cartItemCount = getCartItemCount();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleProfileLinkClick = () => {
    setIsProfileDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header style={{
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '70px',
          flexWrap: 'wrap'
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#059669',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold'
              }}>
                S
              </div>
              SIMBA Shop
            </div>
          </Link>

          {/* Navigation - Hidden on mobile */}
          <nav style={{ 
            display: 'flex', 
            gap: '30px', 
            alignItems: 'center'
          }}>
            <Link to="/" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500' }}>
              Home
            </Link>
            <Link to="/products" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500' }}>
              Products
            </Link>
            <Link to="/seller" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500' }}>
              Sell
            </Link>
          </nav>

          {/* Search Bar - Hidden on mobile */}
          <div style={{ 
            flex: 1, 
            maxWidth: '400px', 
            margin: '0 30px'
          }}>
            <form onSubmit={handleSearch} style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '25px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#059669'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              <button
                type="submit"
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: '#059669',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                🔍
              </button>
            </form>
          </div>

          {/* Right side icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/cart" style={{ position: 'relative', textDecoration: 'none', color: '#374151' }}>
              <div style={{ fontSize: '24px' }}>🛒</div>
              {cartItemCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: '#059669',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            <Link to="/wishlist" style={{ textDecoration: 'none', color: '#374151' }}>
              <div style={{ fontSize: '24px' }}>❤️</div>
            </Link>

            {isAuthenticated ? (
              <div ref={profileDropdownRef} style={{ position: 'relative' }}>
                <div 
                  onClick={handleProfileClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: isProfileDropdownOpen ? '#e5e7eb' : '#f3f4f6'
                  }}
                >
                  <div style={{ fontSize: '20px' }}>👤</div>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>
                    {user?.name || user?.username || 'User'}
                  </span>
                </div>
                
                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e7eb',
                    minWidth: '200px',
                    zIndex: 1000
                  }}>
                    <Link 
                      to="/profile" 
                      onClick={handleProfileLinkClick}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: '#374151',
                        textDecoration: 'none',
                        fontSize: '14px',
                        borderBottom: '1px solid #e5e7eb'
                      }}
                    >
                      👤 Profile
                    </Link>
                    <Link 
                      to="/orders" 
                      onClick={handleProfileLinkClick}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: '#374151',
                        textDecoration: 'none',
                        fontSize: '14px',
                        borderBottom: '1px solid #e5e7eb'
                      }}
                    >
                      📦 Orders
                    </Link>
                    <Link 
                      to="/seller-dashboard" 
                      onClick={handleProfileLinkClick}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: '#374151',
                        textDecoration: 'none',
                        fontSize: '14px',
                        borderBottom: '1px solid #e5e7eb'
                      }}
                    >
                      🏪 Seller Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#dc2626',
                        textAlign: 'left',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" style={{ textDecoration: 'none', color: '#374151' }}>
                <div style={{ fontSize: '24px' }}>👤</div>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                display: 'block',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div style={{
            borderTop: '1px solid #e5e7eb',
            padding: '20px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
            {/* Mobile Search Bar */}
            <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '25px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#059669'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              <button
                type="submit"
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: '#059669',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                🔍
              </button>
            </form>
            
            <Link to="/" style={{ color: '#374151', textDecoration: 'none', padding: '10px 0' }}>
              Home
            </Link>
            <Link to="/products" style={{ color: '#374151', textDecoration: 'none', padding: '10px 0' }}>
              Products
            </Link>
            <Link to="/seller" style={{ color: '#374151', textDecoration: 'none', padding: '10px 0' }}>
              Sell
            </Link>
            <Link to="/cart" style={{ color: '#374151', textDecoration: 'none', padding: '10px 0' }}>
              Cart
            </Link>
            <Link to="/wishlist" style={{ color: '#374151', textDecoration: 'none', padding: '10px 0' }}>
              Wishlist
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" style={{ color: '#374151', textDecoration: 'none', padding: '10px 0' }}>
                  Profile
                </Link>
                <Link to="/orders" style={{ color: '#374151', textDecoration: 'none', padding: '10px 0' }}>
                  Orders
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#dc2626',
                    textAlign: 'left',
                    padding: '10px 0',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" style={{ color: '#374151', textDecoration: 'none', padding: '10px 0' }}>
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;