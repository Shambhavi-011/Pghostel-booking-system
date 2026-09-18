import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '15px 40px', background: 'rgba(255, 255, 255, 0.8)', 
      backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 1000,
      borderBottom: '1px solid #e6d9ef'
    }}>
      {/* Brand Logo / Name */}
      <Link to="/" style={{ textDecoration: 'none', color: '#80608f', fontSize: '24px', fontWeight: 'bold' }}>
        CampusNest ✨
      </Link>

      {/* Login Button */}
      <Link to="/login" style={{
        background: '#af87c8', color: 'white', padding: '10px 20px', 
        borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold',
        boxShadow: '0 4px 6px rgba(175, 135, 200, 0.3)'
      }}>
        Login / Sign Up
      </Link>
    </nav>
  );
};

export default Navbar;