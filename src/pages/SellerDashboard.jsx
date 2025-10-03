import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSeller } from '../contexts/SellerContext';
import { useProducts } from '../contexts/ProductsContext';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiPackage, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { sellerProducts, sellerOrders, loading, error, loadSellerProducts, loadSellerOrders } = useSeller();
  const { deleteProduct } = useProducts();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    images: []
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Check if user is a seller
    if (user?.role !== 'SELLER' && user?.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    loadSellerProducts();
    loadSellerOrders();
  }, [isAuthenticated, user, navigate, loadSellerProducts, loadSellerOrders]);

  if (!isAuthenticated || (user?.role !== 'SELLER' && user?.role !== 'ADMIN')) {
    return null; // Will redirect
  }

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const result = await deleteProduct(productId);
        if (result.success) {
          alert('Product deleted successfully');
          loadSellerProducts();
        } else {
          alert(result.message);
        }
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    // This would integrate with the products context
    alert('Add product functionality will be implemented');
    setShowAddProduct(false);
  };

  const getTotalRevenue = () => {
    return sellerOrders.reduce((total, order) => total + parseFloat(order.total_price || 0), 0);
  };

  const getTotalOrders = () => {
    return sellerOrders.length;
  };

  const getTotalProducts = () => {
    return sellerProducts.length;
  };

  const getLowStockProducts = () => {
    return sellerProducts.filter(product => product.stock <= 5);
  };

  if (loading) {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '20px' }}>⏳</div>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937' }}>
          Loading dashboard...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '20px' }}>❌</div>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#dc2626', marginBottom: '10px' }}>
          Error Loading Dashboard
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '30px' }}>
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: '#059669',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#1f2937'
        }}>
          Seller Dashboard
        </h1>
        
        <button
          onClick={() => setShowAddProduct(true)}
          style={{
          backgroundColor: '#059669',
          color: 'white',
          padding: '12px 24px',
            borderRadius: '8px',
          border: 'none',
          fontSize: '16px',
          fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FiPlus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Tabs */}
        <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '30px',
        borderBottom: '2px solid #e5e7eb'
      }}>
        {['overview', 'products', 'orders'].map((tab) => (
            <button
            key={tab}
            onClick={() => setActiveTab(tab)}
              style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
                border: 'none',
              fontSize: '16px',
              fontWeight: '600',
                cursor: 'pointer',
              color: activeTab === tab ? '#059669' : '#6b7280',
              borderBottom: activeTab === tab ? '2px solid #059669' : '2px solid transparent'
              }}
            >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
        ))}
        </div>

      {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              {/* Stats Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
                marginBottom: '30px'
              }}>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '15px',
              padding: '30px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#059669',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px',
                color: 'white',
                fontSize: '24px'
              }}>
                <FiDollarSign />
                    </div>
              <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '5px' }}>
                ${getTotalRevenue().toFixed(2)}
              </h3>
              <p style={{ color: '#6b7280' }}>Total Revenue</p>
                </div>

                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '15px',
              padding: '30px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px',
                color: 'white',
                fontSize: '24px'
              }}>
                <FiPackage />
                    </div>
              <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '5px' }}>
                {getTotalOrders()}
              </h3>
              <p style={{ color: '#6b7280' }}>Total Orders</p>
                </div>

                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '15px',
              padding: '30px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#f59e0b',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px',
                color: 'white',
                fontSize: '24px'
              }}>
                <FiTrendingUp />
                    </div>
              <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '5px' }}>
                {getTotalProducts()}
              </h3>
              <p style={{ color: '#6b7280' }}>Total Products</p>
                  </div>
                </div>

          {/* Low Stock Alert */}
          {getLowStockProducts().length > 0 && (
                <div style={{
              backgroundColor: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '10px',
              padding: '20px',
              marginBottom: '30px'
            }}>
              <h3 style={{ color: '#92400e', marginBottom: '10px' }}>
                ⚠️ Low Stock Alert
              </h3>
              <p style={{ color: '#92400e', marginBottom: '10px' }}>
                You have {getLowStockProducts().length} products with low stock:
              </p>
              <ul style={{ color: '#92400e', marginLeft: '20px' }}>
                {getLowStockProducts().map(product => (
                  <li key={product.id}>
                    {product.name} - {product.stock} left
                  </li>
                ))}
              </ul>
                    </div>
          )}

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
              marginBottom: '20px'
                }}>
                  Recent Orders
                </h2>
            {sellerOrders.length === 0 ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>
                No orders yet
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#374151' }}>Order ID</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#374151' }}>Product</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#374151' }}>Quantity</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#374151' }}>Total</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#374151' }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#374151' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellerOrders.slice(0, 5).map((order) => (
                      <tr key={order.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px', color: '#374151' }}>
                          #{order.id.slice(-8)}
                        </td>
                        <td style={{ padding: '12px', color: '#374151' }}>
                          Product ID: {order.product_id?.slice(-8) || 'N/A'}
                        </td>
                        <td style={{ padding: '12px', color: '#374151' }}>
                          {order.quantity}
                        </td>
                        <td style={{ padding: '12px', color: '#374151' }}>
                          ${order.total_price}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            backgroundColor: order.status === 'delivered' ? '#d1fae5' : 
                                           order.status === 'shipped' ? '#dbeafe' :
                                           order.status === 'processing' ? '#fef3c7' : '#f3f4f6',
                            color: order.status === 'delivered' ? '#065f46' :
                                  order.status === 'shipped' ? '#1e40af' :
                                  order.status === 'processing' ? '#92400e' : '#374151',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: '#374151' }}>
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                      </div>
                  )}
              </div>
            </div>
          )}

      {/* Products Tab */}
          {activeTab === 'products' && (
        <div>
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
              marginBottom: '20px'
                }}>
                  My Products
                </h2>
            {sellerProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>📦</div>
                <h3 style={{ color: '#6b7280', marginBottom: '10px' }}>No products yet</h3>
                <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                  Start by adding your first product
                </p>
                <button
                  onClick={() => setShowAddProduct(true)}
                  style={{
                  backgroundColor: '#059669',
                  color: 'white',
                    padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                  cursor: 'pointer'
                  }}
                >
                  Add Product
                </button>
              </div>
            ) : (
                  <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {sellerProducts.map((product) => (
                  <div key={product.id} style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    padding: '20px',
                    backgroundColor: '#f9fafb'
                  }}>
                    <img
                      src={product.images?.[0] || '/api/placeholder/300/200'}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        marginBottom: '15px'
                      }}
                    />
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          color: '#1f2937',
                      marginBottom: '8px'
                        }}>
                          {product.name}
                        </h3>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '14px',
                      marginBottom: '10px',
                      lineHeight: '1.4'
                    }}>
                      {product.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '15px'
                    }}>
                      <span style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#059669'
                      }}>
                        ${product.price}
                      </span>
                      <span style={{
                        fontSize: '14px',
                        color: product.stock <= 5 ? '#dc2626' : '#6b7280'
                      }}>
                        Stock: {product.stock}
                      </span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => navigate(`/products/${product.id}`)}
                        style={{
                          flex: 1,
                          backgroundColor: '#f3f4f6',
                          color: '#374151',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px'
                        }}
                      >
                        <FiEye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => alert('Edit functionality will be implemented')}
                        style={{
                          flex: 1,
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px'
                        }}
                      >
                        <FiEdit className="w-4 h-4" />
                          Edit
                        </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        style={{
                          backgroundColor: '#dc2626',
                          color: 'white',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                ))}
              </div>
            )}
              </div>
            </div>
          )}

      {/* Orders Tab */}
          {activeTab === 'orders' && (
        <div>
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
              marginBottom: '20px'
              }}>
              All Orders
              </h2>
            {sellerOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>📦</div>
                <h3 style={{ color: '#6b7280', marginBottom: '10px' }}>No orders yet</h3>
                <p style={{ color: '#6b7280' }}>
                  Orders will appear here when customers purchase your products
                </p>
                  </div>
                ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#374151' }}>Order ID</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#374151' }}>Product</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#374151' }}>Quantity</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#374151' }}>Total</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#374151' }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#374151' }}>Date</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#374151' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sellerOrders.map((order) => (
                      <tr key={order.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px', color: '#374151' }}>
                          #{order.id.slice(-8)}
                        </td>
                        <td style={{ padding: '12px', color: '#374151' }}>
                          Product ID: {order.product_id?.slice(-8) || 'N/A'}
                        </td>
                        <td style={{ padding: '12px', color: '#374151' }}>
                          {order.quantity}
                        </td>
                        <td style={{ padding: '12px', color: '#374151' }}>
                          ${order.total_price}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            backgroundColor: order.status === 'delivered' ? '#d1fae5' : 
                                           order.status === 'shipped' ? '#dbeafe' :
                                           order.status === 'processing' ? '#fef3c7' : '#f3f4f6',
                            color: order.status === 'delivered' ? '#065f46' :
                                  order.status === 'shipped' ? '#1e40af' :
                                  order.status === 'processing' ? '#92400e' : '#374151',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: '#374151' }}>
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <button
                            onClick={() => alert('Update order status functionality will be implemented')}
                            style={{
                          backgroundColor: '#059669',
                          color: 'white',
                              padding: '6px 12px',
                              borderRadius: '4px',
                          border: 'none',
                          fontSize: '12px',
                          cursor: 'pointer'
                            }}
                          >
                          Update Status
                        </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
              </div>
            </div>
          )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '30px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
              marginBottom: '20px'
              }}>
              Add New Product
              </h2>
            
            <form onSubmit={handleAddProduct}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                  Product Name
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                  Description
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  required
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                    Stock
                  </label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '16px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                  Category
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Home">Home</option>
                  <option value="Sports">Sports</option>
                  <option value="Books">Books</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  style={{
                    flex: 1,
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    backgroundColor: '#059669',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Add Product
                </button>
              </div>
            </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;