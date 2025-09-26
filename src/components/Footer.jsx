import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#1f2937',
      color: 'white',
      padding: '60px 20px 30px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* Company Info */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                backgroundColor: '#059669',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                S
              </div>
              <span style={{ fontSize: '28px', fontWeight: 'bold' }}>SIMBA Shop</span>
            </div>
            <p style={{
              color: '#9ca3af',
              lineHeight: '1.6',
              marginBottom: '20px',
              maxWidth: '300px'
            }}>
              Your one-stop destination for quality products. We bring you the best deals 
              on electronics, fashion, home goods, and more. Shop with confidence and 
              enjoy fast, reliable delivery.
            </p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <a href="#" style={{ color: '#9ca3af', fontSize: '24px' }}>📘</a>
              <a href="#" style={{ color: '#9ca3af', fontSize: '24px' }}>🐦</a>
              <a href="#" style={{ color: '#9ca3af', fontSize: '24px' }}>📷</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '20px',
              color: 'white'
            }}>
              Quick Links
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/products" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                All Products
              </Link>
              <Link to="/products?category=electronics" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                Electronics
              </Link>
              <Link to="/products?category=fashion" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                Fashion
              </Link>
              <Link to="/products?category=home" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                Home & Garden
              </Link>
              <Link to="/products?category=sports" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                Sports
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '20px',
              color: 'white'
            }}>
              Customer Service
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/help" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                Help Center
              </Link>
              <Link to="/shipping" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                Shipping Info
              </Link>
              <Link to="/returns" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                Returns
              </Link>
              <Link to="/contact" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                Contact Us
              </Link>
              <Link to="/about" style={{ color: '#9ca3af', textDecoration: 'none' }}>
                About Us
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '20px',
              color: 'white'
            }}>
              Contact Info
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px' }}>📧</span>
                <span style={{ color: '#9ca3af' }}>support@simbashop.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px' }}>📞</span>
                <span style={{ color: '#9ca3af' }}>+1 (555) 123-4567</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px' }}>📍</span>
                <span style={{ color: '#9ca3af' }}>123 Commerce St, City, State 12345</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div style={{
          borderTop: '1px solid #374151',
          paddingTop: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ color: '#9ca3af', fontSize: '14px' }}>
            © 2025 SIMBA Shop. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '30px' }}>
            <Link to="/privacy" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>
              Privacy Policy
            </Link>
            <Link to="/terms" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;