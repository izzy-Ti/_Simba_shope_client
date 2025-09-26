import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductsContext';
import { useAuth } from '../contexts/AuthContext';

const Cart = () => {
  const { cartItems, loading, error, removeFromCart, getCartTotals } = useProducts();
  const { isAuthenticated } = useAuth();

  const handleRemoveFromCart = async (cartId) => {
    const result = await removeFromCart(cartId);
    if (!result.success) {
      alert(result.message);
    }
  };

  const cartTotals = getCartTotals();

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        padding: '20px'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          maxWidth: '500px'
        }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>🔒</div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '10px'
          }}>
            Please Login
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '30px' }}>
            You need to be logged in to view your cart.
          </p>
          <Link to="/login" style={{
            backgroundColor: '#059669',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh'
      }}>
        <div style={{
          fontSize: '24px',
          color: '#059669'
        }}>
          Loading cart...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        flexDirection: 'column'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
        <div style={{ fontSize: '18px', color: '#dc2626' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '30px'
      }}>
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>🛒</div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '10px'
          }}>
            Your cart is empty
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '30px' }}>
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/products" style={{
            backgroundColor: '#059669',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            Start Shopping
          </Link>
        </div>
      ) : (
            <div style={{ 
              display: 'flex', 
              gap: '30px',
              flexDirection: 'column'
            }}>
              {/* Cart Items */}
              <div style={{ flex: 'none' }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '20px 0',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <div style={{ fontSize: '60px' }}>
                    {item.image || '📦'}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '5px'
                    }}>
                      {item.name}
                    </h3>
                    <p style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#059669'
                    }}>
                      ${item.price}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      minWidth: '80px',
                      textAlign: 'right'
                    }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>

                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        fontSize: '20px',
                        cursor: 'pointer',
                        color: '#dc2626'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

              {/* Order Summary */}
              <div style={{ flex: 'none' }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              height: 'fit-content'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '20px'
              }}>
                Order Summary
              </h2>

              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  color: '#374151'
                }}>
                  <span>Subtotal:</span>
                  <span>${cartTotals.subtotal.toFixed(2)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  color: '#374151'
                }}>
                  <span>Shipping:</span>
                  <span>{cartTotals.shipping === 0 ? 'Free' : `$${cartTotals.shipping.toFixed(2)}`}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '15px',
                  color: '#374151'
                }}>
                  <span>Tax:</span>
                  <span>${cartTotals.tax.toFixed(2)}</span>
                </div>
                <div style={{
                  borderTop: '2px solid #e5e7eb',
                  paddingTop: '15px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#1f2937'
                }}>
                  <span>Total:</span>
                  <span>${cartTotals.total.toFixed(2)}</span>
                </div>
              </div>

              <Link to="/checkout" style={{
                display: 'block',
                backgroundColor: '#059669',
                color: 'white',
                padding: '15px 30px',
                borderRadius: '10px',
                textDecoration: 'none',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '15px'
              }}>
                Proceed to Checkout
              </Link>

              <Link to="/products" style={{
                display: 'block',
                backgroundColor: 'transparent',
                color: '#059669',
                padding: '15px 30px',
                borderRadius: '10px',
                textDecoration: 'none',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: '600',
                border: '2px solid #059669'
              }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
