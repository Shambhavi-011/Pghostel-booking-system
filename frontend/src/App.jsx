import React from 'react';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MapComponent from './components/MapComponent';
import Login from './components/Login'; 
import PropertyList from './components/PropertyList';
import AiMatchmaker from './components/AiMatchmaker';
import OwnerDashboard from './components/OwnerDashboard';



const Home = () => (
  <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
    
    {/* Page Header */}
    <div style={{ textAlign: "center", padding: "40px 0 20px 0" }}>
      <h1 style={{ color: "#4a3b52", fontSize: "2.8rem", margin: "0 0 10px 0" }}>
        Find Your Perfect Student Stay
      </h1>
      <p style={{ color: "#786d84", fontSize: "1.2rem", margin: 0 }}>
        AI-powered PG & Hostel recommendations tailored for you
      </p>
    </div>

    {/* AI Matchmaker Component */}
    <AiMatchmaker />

    <hr style={{ margin: "40px 0", border: "1px solid #e6d9ef" }} />

    {/* Real Properties List */}
    <PropertyList />

    <hr style={{ margin: "40px 0", border: "1px solid #e6d9ef" }} />

    {/* Map Section */}
    <h3 style={{ color: "#80608f", textAlign: "center", fontSize: "2rem", marginBottom: "20px" }}>
      Explore Campus Vicinity
    </h3>
    <MapComponent 
      lat={28.9731} 
      lng={77.6402} 
      pgName="MIET College Area" 
      rent={0} 
    />
  </div>
);

function App() {
  return (
    <Router>
      <div style={{ backgroundColor: "#faf8fc", minHeight: "100vh" }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/owner" element={<OwnerDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;