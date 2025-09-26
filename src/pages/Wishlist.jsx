import React from 'react';

const Wishlist = () => {
  const wishlistItems = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      price: 99.99,
      originalPrice: 129.99,
      image: "🎧",
      rating: 4.5,
      reviews: 128,
      inStock: true
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      price: 199.99,
      originalPrice: 249.99,
      image: "⌚",
      rating: 4.8,
      reviews: 89,
      inStock: false
    },
    {
      id: 3,
      name: "Coffee Maker Deluxe",
      price: 149.99,
      originalPrice: 199.99,
      image: "☕",
      rating: 4.6,
      reviews: 67,
      inStock: true
    }
  ];

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '30px'
      }}>
        My Wishlist
      </h1>

      {wishlistItems.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>❤️</div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '10px'
          }}>
            Your wishlist is empty
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '30px' }}>
            Save items you love for later by clicking the heart icon on any product.
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
      ) : (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px'
          }}>
            <p style={{ color: '#6b7280' }}>
              {wishlistItems.length} items in your wishlist
            </p>
            <button style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Clear All
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '25px'
          }}>
            {wishlistItems.map((item) => (
              <div key={item.id} style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: '1px solid #f3f4f6',
                position: 'relative'
              }}>
                {/* Remove from wishlist button */}
                <button style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#dc2626'
                }}>
                  ❤️
                </button>

                <div style={{
                  fontSize: '80px',
                  textAlign: 'center',
                  marginBottom: '20px'
                }}>
                  {item.image}
                </div>

                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '10px',
                  lineHeight: '1.4'
                }}>
                  {item.name}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', marginRight: '8px' }}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color: i < Math.floor(item.rating) ? '#fbbf24' : '#d1d5db', fontSize: '14px' }}>
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span style={{ color: '#6b7280', fontSize: '12px' }}>
                    {item.rating} ({item.reviews})
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                  <span style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#059669'
                  }}>
                    ${item.price}
                  </span>
                  <span style={{
                    fontSize: '16px',
                    color: '#9ca3af',
                    textDecoration: 'line-through'
                  }}>
                    ${item.originalPrice}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px'
                }}>
                  <span style={{
                    fontSize: '12px',
                    color: item.inStock ? '#059669' : '#dc2626',
                    fontWeight: '500'
                  }}>
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    backgroundColor: '#f3f4f6',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}>
                    Save ${(item.originalPrice - item.price).toFixed(2)}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    disabled={!item.inStock}
                    style={{
                      flex: 1,
                      backgroundColor: item.inStock ? '#059669' : '#e5e7eb',
                      color: item.inStock ? 'white' : '#9ca3af',
                      padding: '10px 15px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: item.inStock ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Add to Cart
                  </button>
                  <button style={{
                    backgroundColor: 'transparent',
                    color: '#374151',
                    padding: '10px 15px',
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Move all to cart button */}
          <div style={{
            textAlign: 'center',
            marginTop: '40px',
            padding: '30px',
            backgroundColor: 'white',
            borderRadius: '15px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '15px'
            }}>
              Move all items to cart?
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>
              Add all available items from your wishlist to your cart
            </p>
            <button style={{
              backgroundColor: '#059669',
              color: 'white',
              padding: '15px 30px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginRight: '15px'
            }}>
              Move All to Cart
            </button>
            <button style={{
              backgroundColor: 'transparent',
              color: '#059669',
              padding: '15px 30px',
              borderRadius: '10px',
              border: '2px solid #059669',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              View Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;