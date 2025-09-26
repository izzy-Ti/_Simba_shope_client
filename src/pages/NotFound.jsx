import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
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
        maxWidth: '600px'
      }}>
        <div style={{
          fontSize: '120px',
          marginBottom: '20px',
          color: '#059669'
        }}>
          404
        </div>
        
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '20px'
        }}>
          Page Not Found
        </h1>
        
        <p style={{
          fontSize: '20px',
          color: '#6b7280',
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link to="/" style={{
            backgroundColor: '#059669',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '25px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '16px',
            transition: 'transform 0.2s'
          }}>
            Go Home
          </Link>
          <Link to="/products" style={{
            backgroundColor: 'transparent',
            color: '#059669',
            padding: '15px 30px',
            borderRadius: '25px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '16px',
            border: '2px solid #059669',
            transition: 'transform 0.2s'
          }}>
            Browse Products
          </Link>
        </div>
        
        <div style={{
          marginTop: '60px',
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
            Popular Pages
          </h3>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            flexWrap: 'wrap'
          }}>
            <Link to="/products" style={{
              color: '#059669',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Products
            </Link>
            <Link to="/cart" style={{
              color: '#059669',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Cart
            </Link>
            <Link to="/profile" style={{
              color: '#059669',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Profile
            </Link>
            <Link to="/seller" style={{
              color: '#059669',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Sell
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;