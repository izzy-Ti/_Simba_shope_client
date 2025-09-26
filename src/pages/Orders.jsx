import React from 'react';

const Orders = () => {
  const orders = [
    {
      id: 'ORD-001',
      date: '2025-01-15',
      status: 'Delivered',
      total: 299.98,
      items: [
        { name: 'Wireless Bluetooth Headphones', quantity: 2, price: 99.99 },
        { name: 'Smart Fitness Watch', quantity: 1, price: 199.99 }
      ]
    },
    {
      id: 'ORD-002',
      date: '2025-01-10',
      status: 'Shipped',
      total: 149.99,
      items: [
        { name: 'Coffee Maker Deluxe', quantity: 1, price: 149.99 }
      ]
    },
    {
      id: 'ORD-003',
      date: '2025-01-05',
      status: 'Processing',
      total: 79.99,
      items: [
        { name: 'Gaming Keyboard', quantity: 1, price: 79.99 }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return '#059669';
      case 'Shipped': return '#3b82f6';
      case 'Processing': return '#f59e0b';
      default: return '#6b7280';
    }
  };

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
                  Order #{order.id}
                </h2>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  Placed on {order.date}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '5px'
                }}>
                  ${order.total}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: getStatusColor(order.status),
                  fontWeight: '500',
                  backgroundColor: `${getStatusColor(order.status)}20`,
                  padding: '4px 12px',
                  borderRadius: '20px'
                }}>
                  {order.status}
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
                Items Ordered:
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {order.items.map((item, index) => (
                  <div key={index} style={{
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
                        {item.name}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>
                        Quantity: {item.quantity}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#059669'
                    }}>
                      ${item.price}
                    </div>
                  </div>
                ))}
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
              {order.status === 'Delivered' && (
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
              {order.status === 'Shipped' && (
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

      {orders.length === 0 && (
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
          <button style={{
            backgroundColor: '#059669',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '10px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Start Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;