import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useOrders } from '../contexts/OrdersContext';
import { useAuth } from '../contexts/AuthContext';

const CheckoutForm = ({ cartItems, cartTotals, onSuccess, onError }) => {
  const { createOrder } = useOrders();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    try {
      // For now, we'll create orders directly without payment processing
      // In a real implementation, you'd process payment first
      const orderPromises = cartItems.map(item => 
        createOrder(item.product_id, {
          userId: user.id,
          quantity: item.quantity
        })
      );

      const results = await Promise.all(orderPromises);
      const allSuccessful = results.every(result => result.success);

      if (allSuccessful) {
        onSuccess();
      } else {
        onError('Some orders failed to process');
      }
    } catch (error) {
      onError('Failed to process orders');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '20px'
        }}>
          Payment Information
        </h2>
        
        <div style={{
          padding: '20px',
          border: '2px solid #059669',
          borderRadius: '10px',
          marginBottom: '20px',
          backgroundColor: '#f0fdf4'
        }}>
          <p style={{
            fontSize: '16px',
            color: '#166534',
            textAlign: 'center',
            margin: 0,
            fontWeight: '500'
          }}>
            💳 Secure Payment Processing with Stripe
          </p>
        </div>
        
        <p style={{
          fontSize: '14px',
          color: '#6b7280',
          marginBottom: '20px'
        }}>
          * You will be redirected to our secure payment processor to complete your order.
        </p>
      </div>

      <button
        type="submit"
        disabled={processing}
        style={{
          width: '100%',
          backgroundColor: processing ? '#9ca3af' : '#059669',
          color: 'white',
          padding: '15px 30px',
          borderRadius: '10px',
          border: 'none',
          fontSize: '16px',
          fontWeight: '600',
          cursor: processing ? 'not-allowed' : 'pointer',
          marginTop: '20px'
        }}
      >
{processing ? 'Processing...' : `Proceed to Secure Payment - $${cartTotals.total.toFixed(2)}`}
      </button>
    </form>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotals, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    address: '',
    city: '',
    zipCode: '',
    country: 'US'
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const cartTotals = getCartTotals();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }
  }, [isAuthenticated, cartItems.length, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSuccess = () => {
    // Navigate to payment page with order data (don't clear cart yet)
    const orderData = {
      amount: cartTotals.total,
      currency: 'usd',
      items: cartItems.map(item => ({
        name: item.product?.name || item.name || `Product ${item.product_id}`,
        quantity: item.quantity,
        price: item.product?.price || item.price || 0,
        product_id: item.product_id
      })),
      customer: {
        name: user?.name || user?.username || (formData.firstName + ' ' + formData.lastName),
        email: user?.email || formData.email
      },
      isDirectPurchase: false
    };
    
    navigate('/payment', { state: { orderData } });
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  if (success) {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>✅</div>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#059669',
          marginBottom: '20px'
        }}>
          Order Placed Successfully!
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '30px' }}>
          Thank you for your purchase. You will receive an email confirmation shortly.
        </p>
        <Link
          to="/orders"
          style={{
            backgroundColor: '#059669',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          View Orders
        </Link>
      </div>
    );
  }

  if (!isAuthenticated || cartItems.length === 0) {
    return null; // Will redirect
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '30px'
      }}>
        Checkout
      </h1>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        {/* Checkout Form */}
        <div style={{ flex: 2, minWidth: '300px' }}>
            {/* Contact Information */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              marginBottom: '30px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '20px'
              }}>
                Contact Information
              </h2>
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Shipping Information */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              marginBottom: '30px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '20px'
              }}>
                Shipping Information
              </h2>
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <input
                  type="text"
                  name="zipCode"
                  placeholder="ZIP code"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

          {/* Payment Section */}
          <CheckoutForm
            cartItems={cartItems}
            cartTotals={cartTotals}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </div>

        {/* Order Summary */}
        <div style={{ flex: 1, minWidth: '300px' }}>
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

            {cartItems.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '15px',
                paddingBottom: '15px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div>
                  <div style={{ fontWeight: '500', color: '#374151' }}>
                    {item.product?.name || item.name || `Product ${item.product_id}`}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    Qty: {item.quantity}
                  </div>
                </div>
                <div style={{ fontWeight: '500', color: '#1f2937' }}>
                  ${((item.product?.price || item.price || 0) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}

            <div style={{ marginTop: '20px' }}>
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

            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '12px',
                borderRadius: '8px',
                marginTop: '20px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;