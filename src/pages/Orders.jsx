import React, { useEffect } from 'react';
import { useOrders } from '../contexts/OrdersContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const { orders, loading, error, loadOrderHistory } = useOrders();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadOrderHistory();
  }, [isAuthenticated, navigate, loadOrderHistory]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return '#059669';
      case 'shipped': return '#3b82f6';
      case 'processing': return '#f59e0b';
      case 'pending': return '#6b7280';
      case 'cancelled': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
          Loading orders...
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
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>📦</div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '10px'
          }}>
            No orders yet
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '30px' }}>
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <button 
            onClick={() => navigate('/products')}
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
            Start Shopping
          </button>
        </div>
      ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
        {orders.map((order) => (
          <div key={order.id} style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '30px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6'
          }}>
            {/* Order Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '15px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '5px'
                }}>
                  Order #{order.id.slice(-8)}
                </h2>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  Placed on {formatDate(order.created_at)}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '5px'
                }}>
                  ${order.total_price}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: getStatusColor(order.status),
                  fontWeight: '500',
                  backgroundColor: `${getStatusColor(order.status)}20`,
                  padding: '4px 12px',
                  borderRadius: '20px'
                }}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '15px'
              }}>
                Order Details:
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0'
                }}>
                  <div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#1f2937'
                    }}>
                      Product ID: {order.product_id?.slice(-8) || 'N/A'}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      Quantity: {order.quantity}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#059669'
                  }}>
                    ${order.total_price}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Actions */}
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'flex-end'
            }}>
              <button style={{
                backgroundColor: 'transparent',
                color: '#059669',
                padding: '10px 20px',
                borderRadius: '8px',
                border: '2px solid #059669',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                View Details
              </button>
              {order.status === 'delivered' && (
                <button style={{
                  backgroundColor: '#059669',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  Reorder
                </button>
              )}
              {order.status === 'shipped' && (
                <button style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  Track Package
                </button>
              )}
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
};

export default Orders;