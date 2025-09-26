import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../contexts/ProductsContext';
import { useAuth } from '../contexts/AuthContext';

const Products = () => {
  const [searchParams] = useSearchParams();
  const { products, loading, error, filterProducts, addToCart } = useProducts();
  const { isAuthenticated } = useAuth();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    sortBy: 'newest',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    const applyFilters = async () => {
      const filterParams = {};
      
      if (filters.category) filterParams.category = filters.category;
      if (filters.search) filterParams.search = filters.search;
      if (filters.minPrice) filterParams.minPrice = filters.minPrice;
      if (filters.maxPrice) filterParams.maxPrice = filters.maxPrice;
      if (filters.sortBy) filterParams.sortBy = filters.sortBy;

      await filterProducts(filterParams);
    };

    applyFilters();
  }, [filters.category, filters.search, filters.minPrice, filters.maxPrice, filters.sortBy]);

  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Sports'];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    const result = await addToCart(productId);
    if (result.success) {
      alert('Product added to cart!');
    } else {
      alert(result.message);
    }
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
          Loading products...
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
      {/* Page Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '10px'
        }}>
          All Products
        </h1>
        <p style={{ color: '#6b7280', fontSize: '18px' }}>
          Discover our wide range of quality products
          </p>
        </div>

      <div style={{ 
        display: 'flex', 
        gap: '30px',
        flexDirection: 'column'
      }}>
        {/* Filters Sidebar */}
        <div style={{
          width: '100%',
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          height: 'fit-content'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '20px',
            color: '#1f2937'
          }}>
            Filters
          </h3>

          {/* Search Filter */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '10px'
            }}>
                  Search
                </label>
                  <input
                    type="text"
              placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
              </div>

          {/* Category Filter */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '10px'
            }}>
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            >
                  {categories.map(category => (
                <option key={category} value={category === 'All' ? '' : category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

          {/* Price Range Filter */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '10px'
            }}>
                  Price Range
                </label>
            <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="number"
                placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                  />
                  <input
                    type="number"
                placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                  />
                </div>
              </div>

          {/* Sort By */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '10px'
            }}>
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

        {/* Products Grid */}
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px'
          }}>
            <p style={{ color: '#6b7280' }}>
              Showing {products.length} products
            </p>
          </div>

          {products.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '25px'
            }}>
              {products.map((product) => (
                <div key={product.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  padding: '20px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s',
                  border: '1px solid #f3f4f6'
                }}>
                  <div style={{
                    fontSize: '60px',
                    textAlign: 'center',
                    marginBottom: '15px'
                  }}>
                    {product.image || '📦'}
                  </div>
                  
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '10px',
                    lineHeight: '1.4'
                  }}>
                    {product.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', marginRight: '8px' }}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ color: i < Math.floor(product.rating || 4) ? '#fbbf24' : '#d1d5db', fontSize: '14px' }}>
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span style={{ color: '#6b7280', fontSize: '12px' }}>
                      {product.rating || 4} ({product.reviews || 0})
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                    <span style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#059669'
                    }}>
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span style={{
                        fontSize: '16px',
                        color: '#9ca3af',
                        textDecoration: 'line-through'
                      }}>
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '15px'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      color: product.stock > 0 ? '#059669' : '#dc2626',
                      fontWeight: '500'
                    }}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      backgroundColor: '#f3f4f6',
                      padding: '4px 8px',
                      borderRadius: '4px'
                    }}>
                      {product.category || 'General'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link
                      to={`/products/${product.id}`}
                      style={{
                        flex: 1,
                        backgroundColor: '#059669',
                        color: 'white',
                        padding: '10px 15px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        textAlign: 'center',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={product.stock === 0}
                      style={{
                        backgroundColor: product.stock > 0 ? '#f3f4f6' : '#e5e7eb',
                        color: product.stock > 0 ? '#374151' : '#9ca3af',
                        padding: '10px 15px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: product.stock > 0 ? 'pointer' : 'not-allowed'
                      }}
                    >
                      🛒
                    </button>
                  </div>
                </div>
              ))}
              </div>
            ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: 'white',
              borderRadius: '15px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '80px', marginBottom: '20px' }}>🔍</div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '10px'
              }}>
                No products found
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '30px' }}>
                Try adjusting your filters or search terms.
              </p>
              <button
                onClick={() => setFilters({ category: '', search: '', sortBy: 'newest', minPrice: '', maxPrice: '' })}
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
                Clear Filters
              </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Products;