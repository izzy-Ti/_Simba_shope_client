import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { FiTrash2, FiShoppingCart, FiHeart } from 'react-icons/fi';

const Wishlist = () => {
  const { isAuthenticated } = useAuth();
  const { wishlistItems, loading, error, removeFromWishlist, moveToCart } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '20px' }}>⏳</div>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937' }}>
          Loading your wishlist...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '20px' }}>❌</div>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#dc2626', marginBottom: '10px' }}>
          Error Loading Wishlist
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

  if (wishlistItems.length === 0) {
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
            Add some products to your wishlist to save them for later!
          </p>
          <Link 
            to="/products" 
            style={{
              backgroundColor: '#059669',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600'
            }}
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const handleMoveToCart = async (productId) => {
    try {
      const result = await addToCart(productId);
      if (result.success) {
        alert('Item moved to cart!');
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Failed to add item to cart');
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
        My Wishlist ({wishlistItems.length} items)
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '25px'
      }}>
        {wishlistItems.map((item) => (
          <div key={item.id} style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}>
            <div style={{ position: 'relative', marginBottom: '15px' }}>
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
              
              <button
                onClick={() => removeFromWishlist(item.id)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  border: 'none',
                  color: '#dc2626',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
                title="Remove from wishlist"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
            
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '8px',
              lineHeight: '1.4'
            }}>
              {item.name}
            </h3>
            
            <p style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#059669',
              marginBottom: '15px'
            }}>
              ${item.price}
            </p>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleMoveToCart(item.productId)}
                style={{
                  flex: 1,
                  backgroundColor: '#059669',
                  color: 'white',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px'
                }}
              >
                <FiShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
              
              <Link
                to={`/products/${item.productId}`}
                style={{
                  flex: 1,
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;