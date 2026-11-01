import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { CATALOG_PROPERTIES } from './data';
import Navbar from './components/Navbar';
import MapComponent from './components/MapComponent';
import Login from './components/Login'; 
import PropertyList from './components/PropertyList';
import AiMatchmaker from './components/AiMatchmaker';
import OwnerDashboard from './components/OwnerDashboard';
import AdminDashboard from './components/AdminDashboard';
import MyBookings from './components/MyBookings';

const Home = () => {
  const [mapLocation, setMapLocation] = useState({
    lat: 28.9845, 
    lng: 77.7064, 
    name: 'Meerut City'
  });
  const [recommendedProperties, setRecommendedProperties] = useState([]);
  
  // Trending PGs ke liye states (defaults to verified PGdekho catalog properties)
  const [allProperties, setAllProperties] = useState(CATALOG_PROPERTIES);
  const [visibleCount, setVisibleCount] = useState(4); // Shuru mein 4 PGs dikhenge

  useEffect(() => {
    axios.get("http://localhost:8080/api/properties")
      .then(response => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setAllProperties(response.data);
        } else {
          setAllProperties(CATALOG_PROPERTIES);
        }
      })
      .catch(error => {
        console.info("Backend not active; serving verified PGdekho properties catalog.");
        setAllProperties(CATALOG_PROPERTIES);
      });
  }, []);

  // Sirf utne PGs nikalna jitne visibleCount mein set hain
  const visibleProperties = allProperties.slice(0, visibleCount);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", padding: "40px 0 20px 0" }}>
        <h1 style={{ color: "#4a3b52", fontSize: "2.8rem", margin: "0 0 10px 0" }}>
          Find Your Perfect Student Stay
        </h1>
        <p style={{ color: "#786d84", fontSize: "1.2rem", margin: 0 }}>
          Search by your specific area or college
        </p>
      </div>

      <AiMatchmaker
        onRecommendations={setRecommendedProperties}
        onLocationFound={setMapLocation}
      />

      <hr style={{ margin: "15px 0", border: "1px solid #e6d9ef" }} />
      <PropertyList 
        properties={recommendedProperties} 
        title="✨ AI Recommended PGs & Hostels"
        emptyMessage="Set your preferences above and find your AI-matched stays." 
      />
      <hr style={{ margin: "15px 0", border: "1px solid #e6d9ef" }} />

      {/* Trending Section (Sirf 4 cards ke sath) */}
      <PropertyList 
        properties={visibleProperties} 
        title="🔥 Explore Trending Stays"
        emptyMessage="Loading top stays..." 
      />
      
      {/* LOAD MORE BUTTON */}
      {visibleCount < allProperties.length && (
        <div style={{ textAlign: "center", marginTop: "10px", marginBottom: "30px" }}>
          <button 
            onClick={() => setVisibleCount(visibleCount + 4)}
            style={{
              padding: "12px 30px",
              backgroundColor: "#80608f",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1.1rem",
              transition: "background-color 0.3s",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#624670'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#80608f'}
          >
            Load More Stays ⬇️
          </button>
        </div>
      )}

      <hr style={{ margin: "40px 0", border: "1px solid #e6d9ef" }} />

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h3 style={{ color: "#80608f", fontSize: "2.2rem", margin: "0 0 10px 0", fontWeight: "bold" }}>
          📍 Explore Neighborhoods
        </h3>
        <p style={{ color: "#786d84", fontSize: "1.1rem", fontStyle: "italic", margin: 0 }}>
          "Your next great chapter starts with the perfect place to stay."
        </p>
      </div>
      
      <MapComponent location={mapLocation} properties={recommendedProperties.length > 0 ? recommendedProperties : allProperties} />
      
    </div>
  );
};

function App() {
  return (
    <Router>
      <div style={{ backgroundColor: "#faf8fc", minHeight: "100vh" }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/owner" element={<OwnerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
