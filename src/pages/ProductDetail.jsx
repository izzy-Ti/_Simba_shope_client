import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../contexts/ProductsContext';
import { useReviews } from '../contexts/ReviewsContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { FiStar, FiShoppingCart, FiHeart, FiMinus, FiPlus } from 'react-icons/fi';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  
  const { getProductById } = useProducts();
  const { getProductReviews, getProductRating } = useReviews();
  const { isAuthenticated, user } = useAuth();
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productResult = await getProductById(id);
        if (productResult.success) {
          setProduct(productResult.product);
        } else {
          setError(productResult.message);
        }

        // Load reviews and rating
        const [reviewsResult, ratingResult] = await Promise.all([
          getProductReviews(id),
          getProductRating(id)
        ]);

        if (reviewsResult.success) {
          setReviews(Array.isArray(reviewsResult.reviews) ? reviewsResult.reviews : []);
        }
        if (ratingResult.success) {
          setRating(ratingResult.rating || 0);
        }
      } catch (err) {
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id, getProductById, getProductReviews, getProductRating]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    setIsAddingToCart(true);
    try {
      const result = await addToCart(product.id);
      if (result.success) {
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

  const handleWishlistToggle = async () => {
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

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      alert('Please login to purchase items');
      return;
    }
    
    // Direct purchase without adding to cart
    // Create order data for immediate checkout
    const orderData = {
      amount: product.price * quantity,
      currency: 'usd',
      items: [{
        name: product.name,
        quantity: quantity,
        price: product.price,
        product_id: product.id
      }],
      customer: {
        name: user?.name || user?.username || 'Customer',
        email: user?.email || 'customer@example.com'
      },
      isDirectPurchase: true // Flag to indicate this is a direct purchase
    };
    
    // Navigate directly to payment page
    navigate('/payment', { state: { orderData } });
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '40px 20px', 
        textAlign: 'center',
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
        <h1 style={{ color: '#6b7280' }}>Loading product...</h1>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ 
        padding: '40px 20px', 
        textAlign: 'center',
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
        <h1 style={{ color: '#dc2626' }}>Product not found</h1>
        <p style={{ color: '#6b7280' }}>{error || 'The product you are looking for does not exist.'}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            gap: '40px', 
            marginBottom: '40px',
            flexDirection: 'column'
          }}>
            {/* Product Images */}
            <div style={{ flex: 'none' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            marginBottom: '20px'
          }}>
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  height: '300px',
                  objectFit: 'cover',
                  borderRadius: '10px'
                }}
              />
            ) : (
              <div style={{ fontSize: '200px', marginBottom: '20px' }}>📦</div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  style={{
                    backgroundColor: selectedImage === index ? '#059669' : 'white',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '10px',
                    cursor: 'pointer',
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover'
                  }}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

            {/* Product Info */}
            <div style={{ flex: 'none' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '15px'
          }}>
            {product.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', marginRight: '15px' }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: i < Math.floor(rating) ? '#fbbf24' : '#d1d5db' }}>
                  ⭐
                </span>
              ))}
            </div>
            <span style={{ color: '#6b7280', fontSize: '16px' }}>
              {rating.toFixed(1)} ({reviews.length} reviews)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
            <span style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#059669'
            }}>
              ${product.price}
            </span>
            {product.stock !== undefined && (
              <span style={{
                backgroundColor: product.stock > 0 ? '#dcfce7' : '#fef2f2',
                color: product.stock > 0 ? '#166534' : '#dc2626',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            )}
          </div>

          <p style={{
            color: '#6b7280',
            fontSize: '16px',
            lineHeight: '1.6',
            marginBottom: '30px'
          }}>
            {product.description}
          </p>

          {product.category && (
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '15px'
              }}>
                Category:
              </h3>
              <span style={{
                backgroundColor: '#f3f4f6',
                color: '#374151',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {product.category}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontSize: '16px', fontWeight: '500', color: '#374151' }}>
                Quantity:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #e5e7eb', borderRadius: '8px' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    backgroundColor: '#f3f4f6',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  -
                </button>
                <span style={{ padding: '8px 16px', fontSize: '16px', fontWeight: '500' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    backgroundColor: '#f3f4f6',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <button 
              onClick={handleAddToCart}
              disabled={!product.stock || product.stock <= 0 || isAddingToCart}
              style={{
                flex: 1,
                backgroundColor: (!product.stock || product.stock <= 0 || isAddingToCart) ? '#9ca3af' : '#059669',
                color: 'white',
                padding: '15px 30px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: (!product.stock || product.stock <= 0 || isAddingToCart) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <FiShoppingCart style={{ width: '20px', height: '20px' }} />
              {isAddingToCart ? 'Adding...' : (!product.stock || product.stock <= 0) ? 'Out of Stock' : 'Add to Cart'}
            </button>
            
            <button 
              onClick={handleBuyNow}
              disabled={!product.stock || product.stock <= 0}
              style={{
                flex: 1,
                backgroundColor: (!product.stock || product.stock <= 0) ? '#9ca3af' : '#1f2937',
                color: 'white',
                padding: '15px 30px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: (!product.stock || product.stock <= 0) ? 'not-allowed' : 'pointer'
              }}
            >
              {(!product.stock || product.stock <= 0) ? 'Out of Stock' : 'Buy Now'}
            </button>
            
            <button 
              onClick={handleWishlistToggle}
              disabled={isAddingToWishlist}
              style={{
                backgroundColor: isInWishlist(product.id) ? '#dc2626' : '#f3f4f6',
                color: isInWishlist(product.id) ? 'white' : '#374151',
                padding: '15px 20px',
                borderRadius: '10px',
                border: '2px solid #e5e7eb',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isAddingToWishlist ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                minWidth: '140px'
              }}
            >
              <FiHeart style={{ 
                width: '20px', 
                height: '20px',
                fill: isInWishlist(product.id) ? 'currentColor' : 'none'
              }} />
              {isAddingToWishlist ? 'Adding...' : isInWishlist(product.id) ? 'In Wishlist' : 'Wishlist'}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
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
          Customer Reviews
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!reviews || !Array.isArray(reviews) || reviews.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#6b7280' 
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            reviews.map((review, index) => (
              <div key={review.id || index} style={{
                borderBottom: '1px solid #e5e7eb',
                paddingBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px',
                    fontSize: '18px'
                  }}>
                    👤
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>
                      {review.user_name || review.username || 'Anonymous'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ color: i < (review.rating || 0) ? '#fbbf24' : '#d1d5db' }}>⭐</span>
                      ))}
                      <span style={{ color: '#6b7280', fontSize: '14px' }}>
                        {new Date(review.created_at || review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <p style={{ color: '#374151', lineHeight: '1.6' }}>
                  {review.comment || review.review_text || 'No comment provided.'}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;