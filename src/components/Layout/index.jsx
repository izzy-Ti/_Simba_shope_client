import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';

const Layout = () => {
  console.log('Layout component is rendering');
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <main style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
        <div style={{ padding: '1rem', backgroundColor: 'yellow', border: '2px solid red' }}>
          <p>DEBUG: Layout main content area</p>
          <Outlet />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;