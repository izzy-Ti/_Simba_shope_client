import React, { useState, useEffect } from 'react';
import { useSeller } from '../contexts/SellerContext';
import { useAuth } from '../contexts/AuthContext';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { 
    sellerProducts, 
    sellerOrders, 
    loading, 
    error, 
    loadSellerData, 
    getSellerStats, 
    getRecentOrders, 
    getTopProducts 
  } = useSeller();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadSellerData();
    }
  }, [isAuthenticated, loadSellerData]);

  const stats = getSellerStats();
  const recentOrders = getRecentOrders(5);
  const products = getTopProducts(5);

  if (!isAuthenticated) {
    return (
      <div style={{ 
        padding: '40px 20px', 
        textAlign: 'center',
        maxWidth: '1400px', 
        margin: '0 auto' 
      }}>
        <h1 style={{ color: '#dc2626', fontSize: '24px' }}>
          Please login to access the seller dashboard
        </h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ 
        padding: '40px 20px', 
        textAlign: 'center',
        maxWidth: '1400px', 
        margin: '0 auto' 
      }}>
        <div style={{ fontSize: '24px', marginBottom: '20px' }}>⏳</div>
        <h1 style={{ color: '#6b7280' }}>Loading dashboard...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '40px 20px', 
        textAlign: 'center',
        maxWidth: '1400px', 
        margin: '0 auto' 
      }}>
        <div style={{ fontSize: '24px', marginBottom: '20px' }}>❌</div>
        <h1 style={{ color: '#dc2626' }}>Error loading dashboard</h1>
        <p style={{ color: '#6b7280' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#1f2937'
        }}>
          Seller Dashboard
        </h1>
        <button style={{
          backgroundColor: '#059669',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '10px',
          border: 'none',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          + Add Product
        </button>
      </div>

      <div style={{ display: 'flex', gap: '30px' }}>
        {/* Sidebar */}
        <div style={{
          width: '250px',
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          height: 'fit-content'
        }}>
          <nav>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                backgroundColor: activeTab === 'overview' ? '#059669' : 'transparent',
                color: activeTab === 'overview' ? 'white' : '#374151',
                borderRadius: '8px',
                textAlign: 'left',
                cursor: 'pointer',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('products')}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                backgroundColor: activeTab === 'products' ? '#059669' : 'transparent',
                color: activeTab === 'products' ? 'white' : '#374151',
                borderRadius: '8px',
                textAlign: 'left',
                cursor: 'pointer',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              📦 Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                backgroundColor: activeTab === 'orders' ? '#059669' : 'transparent',
                color: activeTab === 'orders' ? 'white' : '#374151',
                borderRadius: '8px',
                textAlign: 'left',
                cursor: 'pointer',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              🛒 Orders
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                backgroundColor: activeTab === 'analytics' ? '#059669' : 'transparent',
                color: activeTab === 'analytics' ? 'white' : '#374151',
                borderRadius: '8px',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              📈 Analytics
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          {activeTab === 'overview' && (
            <div>
              {/* Stats Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '25px',
                marginBottom: '30px'
              }}>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  padding: '25px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #f3f4f6'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '5px' }}>Total Revenue</p>
                      <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>${stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div style={{ fontSize: '40px' }}>💰</div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  padding: '25px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #f3f4f6'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '5px' }}>Total Orders</p>
                      <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>{stats.totalOrders}</p>
                    </div>
                    <div style={{ fontSize: '40px' }}>📦</div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  padding: '25px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #f3f4f6'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '5px' }}>Products</p>
                      <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>{stats.totalProducts}</p>
                    </div>
                    <div style={{ fontSize: '40px' }}>🏷️</div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  padding: '25px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #f3f4f6'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '5px' }}>Revenue</p>
                      <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>${stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div style={{ fontSize: '40px' }}>📈</div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                padding: '30px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '25px'
                }}>
                  Recent Orders
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {recentOrders.length === 0 ? (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '20px', 
                      color: '#6b7280' 
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '12px' }}>🛒</div>
                      <p>No recent orders</p>
                    </div>
                  ) : (
                    recentOrders.map((order) => (
                      <div key={order.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '15px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '10px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '5px' }}>
                            Order #{order.id}
                          </div>
                          <div style={{ fontSize: '14px', color: '#6b7280' }}>
                            {order.customer_name || 'N/A'} • {order.product_name || 'N/A'}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: '600', color: '#059669', marginBottom: '5px' }}>
                            ${order.total_amount || order.total || 0}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: order.status === 'completed' ? '#059669' : 
                                   order.status === 'pending' ? '#f59e0b' : '#3b82f6',
                            backgroundColor: `${order.status === 'completed' ? '#059669' : 
                                            order.status === 'pending' ? '#f59e0b' : '#3b82f6'}20`,
                            padding: '2px 8px',
                            borderRadius: '12px'
                          }}>
                            {order.status || 'Unknown'}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1f2937'
                }}>
                  My Products
                </h2>
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
                  + Add New Product
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {products.length === 0 ? (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '40px', 
                    color: '#6b7280' 
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                    <p>No products found. Add your first product to get started!</p>
                  </div>
                ) : (
                  products.map((product) => (
                    <div key={product.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      padding: '20px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '10px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ fontSize: '50px' }}>
                        {product.images && product.images.length > 0 ? '🖼️' : '📦'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '5px'
                        }}>
                          {product.name}
                        </h3>
                        <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#6b7280' }}>
                          <span>Price: ${product.price}</span>
                          <span>Stock: {product.stock || 0}</span>
                          <span>Category: {product.category || 'N/A'}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          border: 'none',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}>
                          Edit
                        </button>
                        <button style={{
                          backgroundColor: '#dc2626',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          border: 'none',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '25px'
              }}>
                Order Management
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {recentOrders.length === 0 ? (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '40px', 
                    color: '#6b7280' 
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
                    <p>No orders found. Your orders will appear here when customers make purchases!</p>
                  </div>
                ) : (
                  recentOrders.map((order) => (
                    <div key={order.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '20px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '10px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '5px' }}>
                          Order #{order.id}
                        </div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>
                          Customer: {order.customer_name || 'N/A'} • Product: {order.product_name || 'N/A'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                          {new Date(order.created_at || order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: '600', color: '#059669', marginBottom: '5px' }}>
                            ${order.total_amount || order.total || 0}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: order.status === 'completed' ? '#059669' : 
                                   order.status === 'pending' ? '#f59e0b' : '#3b82f6',
                            backgroundColor: `${order.status === 'completed' ? '#059669' : 
                                            order.status === 'pending' ? '#f59e0b' : '#3b82f6'}20`,
                            padding: '2px 8px',
                            borderRadius: '12px'
                          }}>
                            {order.status || 'Unknown'}
                          </div>
                        </div>
                        <button style={{
                          backgroundColor: '#059669',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          border: 'none',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}>
                          Update Status
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '30px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '25px'
              }}>
                Sales Analytics
              </h2>
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>📊</div>
                <p>Analytics charts and reports will be displayed here.</p>
                <p>Track your sales performance, customer behavior, and product trends.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;