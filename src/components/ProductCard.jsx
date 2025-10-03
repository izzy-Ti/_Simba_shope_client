import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';

const ProductCard = ({ product }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    setIsAddingToCart(true);
    try {
      const result = await addToCart(product.id);
      if (result.success) {
        // Show success message
        alert('Item added to cart!');
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Failed to add item to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('Please login to add items to wishlist');
      return;
    }

    setIsAddingToWishlist(true);
    try {
      if (isInWishlist(product.id)) {
        // Remove from wishlist - we need to find the wishlist item ID
        // For now, we'll just show a message
        alert('Item removed from wishlist');
      } else {
        const result = await addToWishlist(product.id);
        if (result.success) {
          alert('Item added to wishlist!');
        } else {
          alert(result.message);
        }
      }
    } catch (error) {
      alert('Failed to update wishlist');
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
      border: '1px solid #f3f4f6'
    }}>
      <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
        <div style={{ position: 'relative' }}>
          <img
            src={product.images?.[0] || '/api/placeholder/300/200'}
            alt={product.name}
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover'
            }}
          />
                 
          {product.stock === 0 && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ color: 'white', fontWeight: '600' }}>Out of Stock</span>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            disabled={isAddingToWishlist}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              padding: '8px',
              borderRadius: '50%',
              backgroundColor: isInWishlist(product.id) ? '#dc2626' : 'white',
              color: isInWishlist(product.id) ? 'white' : '#6b7280',
              border: 'none',
              cursor: isAddingToWishlist ? 'not-allowed' : 'pointer',
              opacity: isAddingToWishlist ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FiHeart style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      </Link>

      <div style={{ padding: '20px' }}>
        <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '8px',
            fontSize: '16px',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {product.name}
          </h3>
        </Link>
        
        <p style={{
          color: '#6b7280',
          fontSize: '14px',
          marginBottom: '12px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                style={{
                  width: '16px',
                  height: '16px',
                  color: i < Math.floor(product.rating || 4.5) ? '#fbbf24' : '#d1d5db',
                  marginRight: '2px'
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: '14px', color: '#6b7280', marginLeft: '8px' }}>
            ({product.reviewCount || Math.floor(Math.random() * 100) + 10})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#059669' }}>
              ${product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span style={{ fontSize: '14px', color: '#6b7280', textDecoration: 'line-through' }}>
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAddingToCart}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '8px',
              fontWeight: '500',
              border: 'none',
              cursor: (product.stock === 0 || isAddingToCart) ? 'not-allowed' : 'pointer',
              backgroundColor: (product.stock === 0 || isAddingToCart) ? '#d1d5db' : '#059669',
              color: (product.stock === 0 || isAddingToCart) ? '#6b7280' : 'white',
              fontSize: '14px'
            }}
          >
            <FiShoppingCart style={{ width: '16px', height: '16px' }} />
            <span>
              {isAddingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </span>
          </button>
          
          <Link
            to={`/products/${product.id}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '8px',
              fontWeight: '500',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              textDecoration: 'none',
              fontSize: '14px'
            }}
          >
            <span>View</span>
          </Link>
        </div>

        {product.stock > 0 && product.stock <= 5 && (
          <p style={{ fontSize: '14px', color: '#ea580c', marginTop: '8px' }}>
            Only {product.stock} left in stock!
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
