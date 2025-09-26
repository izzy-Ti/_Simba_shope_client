import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../contexts/ProductsContext';

const Home = () => {
  const { products, loadProducts, loading } = useProducts();

  useEffect(() => {
    loadProducts();
  }, []);

  const featuredProducts = products.slice(0, 4);

  const categories = [
    { name: 'Electronics', icon: '📱', count: '1,234 products' },
    { name: 'Fashion', icon: '👗', count: '856 products' },
    { name: 'Home & Garden', icon: '🏠', count: '432 products' },
    { name: 'Sports', icon: '⚽', count: '678 products' }
  ];

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
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            Welcome to SIMBA Shop
          </h1>
          <p style={{
            fontSize: '20px',
            marginBottom: '40px',
            opacity: 0.9
          }}>
            Discover amazing products at unbeatable prices. Shop with confidence and enjoy fast, reliable delivery.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/products" style={{
              backgroundColor: 'white',
              color: '#059669',
              padding: '15px 30px',
              borderRadius: '25px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '16px',
              transition: 'transform 0.2s'
            }}>
              Shop Now
            </Link>
            <Link to="/products?category=electronics" style={{
              backgroundColor: 'transparent',
              color: 'white',
              padding: '15px 30px',
              borderRadius: '25px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '16px',
              border: '2px solid white',
              transition: 'transform 0.2s'
            }}>
              Electronics
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '80px 20px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '15px'
            }}>
              Featured Products
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Handpicked products just for you
            </p>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '30px'
            }}>
              {featuredProducts.map((product) => (
                <div key={product.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  padding: '25px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  border: '1px solid #f3f4f6'
                }}>
                  <div style={{
                    fontSize: '80px',
                    textAlign: 'center',
                    marginBottom: '20px'
                  }}>
                    {product.image || '📦'}
                  </div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '10px'
                  }}>
                    {product.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{ display: 'flex', marginRight: '10px' }}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ color: i < Math.floor(product.rating || 4) ? '#fbbf24' : '#d1d5db' }}>
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>
                      {product.rating || 4} ({product.reviews || 0} reviews)
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#059669'
                    }}>
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span style={{
                        fontSize: '18px',
                        color: '#9ca3af',
                        textDecoration: 'line-through'
                      }}>
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <Link to={`/products/${product.id}`} style={{
                    display: 'block',
                    backgroundColor: '#059669',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontWeight: '600',
                    transition: 'background-color 0.2s'
                  }}>
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>📦</div>
              <p>No products available at the moment.</p>
            </div>
          )}
          
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Link to="/products" style={{
              backgroundColor: '#059669',
              color: 'white',
              padding: '15px 30px',
              borderRadius: '25px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '16px',
              display: 'inline-block'
            }}>
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ padding: '80px 20px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '15px'
            }}>
              Shop by Category
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Find exactly what you're looking for
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px'
          }}>
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/products?category=${category.name.toLowerCase()}`}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  padding: '40px 30px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  color: 'inherit',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  border: '1px solid #f3f4f6'
                }}
              >
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>
                  {category.icon}
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '10px'
                }}>
                  {category.name}
                </h3>
                <p style={{
                  color: '#6b7280',
                  fontSize: '16px'
                }}>
                  {category.count}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section style={{
        padding: '80px 20px',
        backgroundColor: '#1f2937',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '20px'
          }}>
            Stay Updated
          </h2>
          <p style={{
            fontSize: '18px',
            marginBottom: '40px',
            opacity: 0.9
          }}>
            Subscribe to our newsletter for the latest deals and product updates
          </p>
          <div style={{
            display: 'flex',
            gap: '15px',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                flex: 1,
                padding: '15px 20px',
                borderRadius: '25px',
                border: 'none',
                fontSize: '16px',
                outline: 'none'
              }}
            />
            <button style={{
              backgroundColor: '#059669',
              color: 'white',
              padding: '15px 30px',
              borderRadius: '25px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;