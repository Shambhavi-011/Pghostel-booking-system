import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  
  // Browser ke local storage se user ka role check karo
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.clear(); // Saara saved data (role, email) delete kar do
    navigate('/login'); // Wapas login page par bhej do
  };

  return (
    <nav style={{ 
      backgroundColor: '#fff', 
      padding: '15px 40px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* UNIQUE LOGO WITH SUBTITLE */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
        <span style={{ color: '#4a3b52', fontSize: '1.6rem', fontWeight: '900', letterSpacing: '-0.5px' }}>
          AlgoRooms✨
        </span>
        <span style={{ color: '#80608f', fontSize: '0.75rem', fontWeight: '600', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          PG/Hostel Booking System with AI Recommendation
        </span>
      </Link>

      {/* NAVIGATION LINKS */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#786d84', fontWeight: '500' }}>
          Home
        </Link>
        
        {/* Agar Owner login hai tabhi Owner Dashboard dikhao */}
        {userRole === 'owner' && (
          <Link to="/owner" style={{ textDecoration: 'none', color: '#786d84', fontWeight: '500' }}>
            Owner Dashboard
          </Link>
        )}
        
        {/* LOGIN / LOGOUT BUTTON LOGIC */}
        {userRole ? (
          <button 
            onClick={handleLogout}
            style={{ 
              padding: '8px 20px', 
              backgroundColor: '#ff4d4d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '20px', 
              fontWeight: 'bold',
              cursor: 'pointer' 
            }}>
            Logout
          </button>
        ) : (
          <button 
            onClick={() => navigate('/login')}
            style={{ 
              padding: '8px 20px', 
              backgroundColor: '#e6d9ef', 
              color: '#4a3b52', 
              border: 'none', 
              borderRadius: '20px', 
              fontWeight: 'bold',
              cursor: 'pointer' 
            }}>
            Login / Sign Up
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;