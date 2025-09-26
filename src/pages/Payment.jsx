import React, { useState } from 'react';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    phone: ''
  });

  const orderSummary = {
    items: [
      { name: 'Wireless Bluetooth Headphones', quantity: 2, price: 99.99 },
      { name: 'Smart Fitness Watch', quantity: 1, price: 199.99 }
    ],
    subtotal: 399.97,
    shipping: 9.99,
    tax: 32.80,
    total: 442.76
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Payment processing:', { paymentMethod, formData });
    // Handle payment processing
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '30px'
      }}>
        Payment
      </h1>

      <div style={{ display: 'flex', gap: '30px' }}>
        {/* Payment Form */}
        <div style={{ flex: 2 }}>
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
              marginBottom: '25px'
            }}>
              Payment Method
            </h2>

            {/* Payment Method Selection */}
            <div style={{ marginBottom: '25px' }}>
              <div style={{
                display: 'flex',
                gap: '15px',
                marginBottom: '20px'
              }}>
                <button
                  onClick={() => setPaymentMethod('card')}
                  style={{
                    flex: 1,
                    padding: '15px',
                    border: paymentMethod === 'card' ? '2px solid #059669' : '2px solid #e5e7eb',
                    borderRadius: '10px',
                    backgroundColor: paymentMethod === 'card' ? '#f0fdf4' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                >
                  💳 Credit/Debit Card
                </button>
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  style={{
                    flex: 1,
                    padding: '15px',
                    border: paymentMethod === 'paypal' ? '2px solid #059669' : '2px solid #e5e7eb',
                    borderRadius: '10px',
                    backgroundColor: paymentMethod === 'paypal' ? '#f0fdf4' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                >
                  📘 PayPal
                </button>
                <button
                  onClick={() => setPaymentMethod('apple')}
                  style={{
                    flex: 1,
                    padding: '15px',
                    border: paymentMethod === 'apple' ? '2px solid #059669' : '2px solid #e5e7eb',
                    borderRadius: '10px',
                    backgroundColor: paymentMethod === 'apple' ? '#f0fdf4' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                >
                  🍎 Apple Pay
                </button>
              </div>
            </div>

            {/* Payment Form */}
            {paymentMethod === 'card' && (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
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

                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
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
                  <div style={{ flex: 1 }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
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

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleChange}
                    placeholder="John Doe"
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

                <div style={{ marginBottom: '25px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: '#374151',
                    cursor: 'pointer'
                  }}>
                    <input type="checkbox" style={{ margin: 0 }} />
                    Save this card for future purchases
                  </label>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
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
                  Complete Payment - ${orderSummary.total.toFixed(2)}
                </button>
              </form>
            )}

            {paymentMethod === 'paypal' && (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                backgroundColor: '#f8fafc',
                borderRadius: '10px',
                border: '2px dashed #e5e7eb'
              }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>📘</div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '10px'
                }}>
                  PayPal Payment
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                  You will be redirected to PayPal to complete your payment
                </p>
                <button style={{
                  backgroundColor: '#0070ba',
                  color: 'white',
                  padding: '15px 30px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Pay with PayPal
                </button>
              </div>
            )}

            {paymentMethod === 'apple' && (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                backgroundColor: '#f8fafc',
                borderRadius: '10px',
                border: '2px dashed #e5e7eb'
              }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>🍎</div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '10px'
                }}>
                  Apple Pay
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                  Complete your payment securely with Apple Pay
                </p>
                <button style={{
                  backgroundColor: '#000000',
                  color: 'white',
                  padding: '15px 30px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Pay with Apple Pay
                </button>
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div style={{
            backgroundColor: '#f0fdf4',
            borderRadius: '10px',
            padding: '20px',
            border: '1px solid #bbf7d0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '20px' }}>🔒</div>
              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#166534',
                  marginBottom: '5px'
                }}>
                  Secure Payment
                </h4>
                <p style={{
                  fontSize: '14px',
                  color: '#166534',
                  margin: 0
                }}>
                  Your payment information is encrypted and secure. We never store your card details.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ flex: 1 }}>
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
              {orderSummary.items.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  paddingBottom: '10px',
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
            </div>

            <div style={{ marginTop: '20px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
                color: '#374151'
              }}>
                <span>Subtotal:</span>
                <span>${orderSummary.subtotal.toFixed(2)}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
                color: '#374151'
              }}>
                <span>Shipping:</span>
                <span>${orderSummary.shipping.toFixed(2)}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '15px',
                color: '#374151'
              }}>
                <span>Tax:</span>
                <span>${orderSummary.tax.toFixed(2)}</span>
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
                <span>${orderSummary.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;