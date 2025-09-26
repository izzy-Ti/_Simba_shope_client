import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from '../pages/Home';

function AppContent() {
  console.log('AppContent is rendering');
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <main style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
        <div style={{ padding: '1rem', backgroundColor: 'yellow', border: '2px solid red' }}>
          <p>DEBUG: AppContent main content area</p>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<div style={{ padding: '2rem', backgroundColor: 'lightblue' }}>404 - Page Not Found</div>} />
          </Routes>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default AppContent;