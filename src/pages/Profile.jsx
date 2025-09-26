import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrdersContext';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { user, isAuthenticated, getUserData, loading: authLoading } = useAuth();
  const { orders, loadOrderHistory, loading: ordersLoading } = useOrders();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Initialize profile data from user context
      setProfileData({
        firstName: user.name?.split(' ')[0] || user.username || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
      
      // Load order history
      loadOrderHistory();
    }
  }, [isAuthenticated, user, loadOrderHistory]);

  const handleSaveProfile = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Here you would typically call an API to update the profile
      // For now, we'll just show a success message
      alert('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            You need to be logged in to view your profile.
          </p>
          <a href="/login" style={{
            backgroundColor: '#059669',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            Login Now
          </a>
        </div>
      </div>
    );
  }

  if (authLoading) {
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
          Loading profile...
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
        My Account
      </h1>

          <div style={{ 
            display: 'flex', 
            gap: '30px',
            flexDirection: 'column'
          }}>
            {/* Sidebar */}
            <div style={{
              width: '100%',
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '25px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              height: 'fit-content'
            }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '30px',
            paddingBottom: '20px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#f3f4f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              margin: '0 auto 15px'
            }}>
              👤
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '5px'
            }}>
              {user?.name || user?.username || 'User'}
            </h3>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              {user?.email || 'No email'}
            </p>
          </div>

          <nav>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                backgroundColor: activeTab === 'profile' ? '#059669' : 'transparent',
                color: activeTab === 'profile' ? 'white' : '#374151',
                borderRadius: '8px',
                textAlign: 'left',
                cursor: 'pointer',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              👤 Profile
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
              📦 Orders
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                backgroundColor: activeTab === 'wishlist' ? '#059669' : 'transparent',
                color: activeTab === 'wishlist' ? 'white' : '#374151',
                borderRadius: '8px',
                textAlign: 'left',
                cursor: 'pointer',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              ❤️ Wishlist
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                backgroundColor: activeTab === 'settings' ? '#059669' : 'transparent',
                color: activeTab === 'settings' ? 'white' : '#374151',
                borderRadius: '8px',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              ⚙️ Settings
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          {activeTab === 'profile' && (
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
                Profile Information
              </h2>

              <form>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
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
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
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
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
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

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
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

                <div style={{ marginBottom: '30px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Address
                  </label>
                  <textarea
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '16px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button 
                  onClick={handleSaveProfile}
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? '#9ca3af' : '#059669',
                    color: 'white',
                    padding: '12px 30px',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
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
                Order History
              </h2>

              {ordersLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ fontSize: '24px', color: '#059669' }}>Loading orders...</div>
                </div>
              ) : orders.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#6b7280'
                }}>
                  <div style={{ fontSize: '60px', marginBottom: '20px' }}>📦</div>
                  <p>No orders found. Start shopping to see your orders here!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {orders.map((order) => (
                    <div key={order.id} style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '10px',
                      padding: '20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '5px'
                        }}>
                          Order #{order.id}
                        </div>
                        <div style={{ color: '#6b7280', fontSize: '14px' }}>
                          Placed on {new Date(order.created_at || order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: '#1f2937',
                          marginBottom: '5px'
                        }}>
                          ${order.total_price || order.total || 0}
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: order.status === 'delivered' ? '#059669' : 
                                 order.status === 'shipped' ? '#3b82f6' : 
                                 order.status === 'completed' ? '#059669' : '#f59e0b',
                          fontWeight: '500'
                        }}>
                          {order.status || 'Unknown'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
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
                My Wishlist
              </h2>
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>❤️</div>
                <p>No items in your wishlist yet.</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
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
                Account Settings
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '10px'
                  }}>
                    Change Password
                  </h3>
                  <button style={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    Change Password
                  </button>
                </div>
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '10px'
                  }}>
                    Notification Preferences
                  </h3>
                  <button style={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    Manage Notifications
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;