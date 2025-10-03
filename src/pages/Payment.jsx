import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrdersContext';
import { useCart } from '../contexts/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_key_here');

// Simulate backend payment processing
const simulateBackendPayment = async (paymentMethod, orderData) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate different payment outcomes based on card number
  const cardLast4 = paymentMethod.card.last4;
  
  // Test card scenarios
  if (cardLast4 === '0002') {
    return { success: false, error: 'Your card was declined.' };
  } else if (cardLast4 === '9999') {
    return { success: false, error: 'Insufficient funds.' };
  } else if (cardLast4 === '4242' || cardLast4 === '0000' || cardLast4 === '0005') {
    // Successful payment
    return { 
      success: true, 
      paymentIntent: {
        id: `pi_${Math.random().toString(36).substr(2, 9)}`,
        status: 'succeeded',
        amount: Math.round(orderData.amount * 100), // Convert to cents
        currency: orderData.currency
      }
    };
  } else {
    // Default success for other cards
    return { 
      success: true, 
      paymentIntent: {
        id: `pi_${Math.random().toString(36).substr(2, 9)}`,
        status: 'succeeded',
        amount: Math.round(orderData.amount * 100),
        currency: orderData.currency
      }
    };
  }
};

// Payment form component
const PaymentForm = ({ orderData, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError('');

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setError(error.message);
        onError(error.message);
      } else {
        // Create payment intent and confirm payment
        console.log('Payment method created:', paymentMethod);
        
        try {
          // Simulate backend payment processing
          const paymentResult = await simulateBackendPayment(paymentMethod, orderData);
          
          if (paymentResult.success) {
            onSuccess(paymentMethod);
          } else {
            setError(paymentResult.error || 'Payment failed');
            onError(paymentResult.error || 'Payment failed');
          }
        } catch (backendError) {
          console.error('Backend payment error:', backendError);
          setError('Payment processing failed. Please try again.');
          onError('Payment processing failed. Please try again.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
      onError('An unexpected error occurred');
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
          Secure Payment with Stripe
        </h2>
        
        <div style={{
          padding: '15px',
          border: '2px solid #059669',
          borderRadius: '8px',
          marginBottom: '20px',
          backgroundColor: '#f0fdf4'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#166534',
            margin: 0,
            fontWeight: '500'
          }}>
            🔒 Powered by Stripe - Your payment information is secure and encrypted
          </p>
        </div>
        
        <div style={{
          padding: '20px',
          border: '2px solid #e5e7eb',
          borderRadius: '10px',
          marginBottom: '20px',
          backgroundColor: '#f9fafb'
        }}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || processing}
          style={{
            width: '100%',
            backgroundColor: (!stripe || processing) ? '#9ca3af' : '#059669',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '600',
            cursor: (!stripe || processing) ? 'not-allowed' : 'pointer',
            marginTop: '20px'
          }}
        >
          {processing ? 'Processing...' : `Pay $${orderData.amount.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
};

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { createOrder, confirmPayment } = useOrders();
  const { clearCart } = useCart();
  const [orderData, setOrderData] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Get order data from location state or create mock data
    const data = location.state?.orderData || {
      amount: 99.99,
      currency: 'usd',
      items: [
        { 
          name: 'Sample Product', 
          quantity: 1, 
          price: 99.99,
          product_id: 'sample-id'
        }
      ],
      customer: {
        name: user?.name || user?.username || 'Customer',
        email: user?.email || 'customer@example.com'
      },
      isDirectPurchase: false
    };
    
    setOrderData(data);
  }, [isAuthenticated, navigate, location.state, user]);

  const handlePaymentSuccess = async (paymentMethod) => {
    try {
      setSuccess(true);
      
      console.log('Payment successful:', paymentMethod);
      console.log('Order data:', orderData);
      
      // Create order record
      if (orderData.isDirectPurchase) {
        // For direct purchases, create single order
        const orderResult = await createOrder(orderData.items[0].product_id, {
          userId: user.id,
          quantity: orderData.items[0].quantity,
          total: orderData.amount,
          paymentMethod: paymentMethod.id
        });
        
        if (!orderResult.success) {
          throw new Error(orderResult.message || 'Failed to create order');
        }
      } else {
        // For cart purchases, create multiple orders
        const orderPromises = orderData.items.map(item => 
          createOrder(item.product_id, {
            userId: user.id,
            quantity: item.quantity,
            total: item.price * item.quantity,
            paymentMethod: paymentMethod.id
          })
        );
        
        const results = await Promise.all(orderPromises);
        const allSuccessful = results.every(result => result.success);
        
        if (!allSuccessful) {
          throw new Error('Some orders failed to process');
        }
      }
      
      // Clear cart if this was a cart purchase
      if (!orderData.isDirectPurchase) {
        clearCart();
      }
      
      // Simulate order processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    } catch (err) {
      setError('Failed to process payment: ' + err.message);
      console.error('Payment processing error:', err);
    }
  };

  const handlePaymentError = (errorMessage) => {
    setError(errorMessage);
  };

  if (!isAuthenticated) {
    return null;
  }

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
          Payment Successful!
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '30px' }}>
          Your payment has been processed successfully through Stripe! You will receive an email confirmation shortly with your order details.
        </p>
        <button
          onClick={() => navigate('/orders')}
          style={{
            backgroundColor: '#059669',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          View Orders
        </button>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
        <h2 style={{ color: '#6b7280' }}>Loading payment details...</h2>
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
        Complete Payment
      </h1>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        {/* Payment Form */}
        <div style={{ flex: 2, minWidth: '300px' }}>
          <Elements stripe={stripePromise}>
            <PaymentForm
              orderData={orderData}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Elements>
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

            {orderData.items?.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '15px',
                paddingBottom: '15px',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div>
                  <div style={{ fontWeight: '500', color: '#374151' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    Qty: {item.quantity}
                  </div>
                </div>
                <div style={{ fontWeight: '500', color: '#1f2937' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}

            <div style={{ marginTop: '20px' }}>
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
                <span>${orderData.amount.toFixed(2)}</span>
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

export default Payment;