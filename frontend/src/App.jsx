import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MapComponent from './components/MapComponent';
import Login from './components/Login'; 
import PropertyList from './components/PropertyList';
import AiMatchmaker from './components/AiMatchmaker';
import OwnerDashboard from './components/OwnerDashboard';

const Home = () => {
  // Default map center (Meerut City)
  const [mapLocation, setMapLocation] = useState({
    lat: 28.9845, 
    lng: 77.7064, 
    name: 'Meerut City'
  });

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

      {/* AI Matchmaker jisme hum setMapLocation pass kar rahe hain */}
      <AiMatchmaker onLocationFound={(lat, lng, areaName) => setMapLocation({ lat, lng, name: areaName })} />

      <hr style={{ margin: "40px 0", border: "1px solid #e6d9ef" }} />
      <PropertyList />
      <hr style={{ margin: "40px 0", border: "1px solid #e6d9ef" }} />

      <hr style={{ margin: "40px 0", border: "1px solid #e6d9ef" }} />

      {/* NEW STYLED MAP HEADING WITH QUOTE */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h3 style={{ color: "#80608f", fontSize: "2.2rem", margin: "0 0 10px 0", fontWeight: "bold" }}>
          📍 Explore Neighborhoods
        </h3>
        <p style={{ color: "#786d84", fontSize: "1.1rem", fontStyle: "italic", margin: 0 }}>
          "Your next great chapter starts with the perfect place to stay."
        </p>
      </div>
      
      {/* Map ko dynamic coordinates pass kar rahe hain */}
      <MapComponent location={mapLocation} />
      
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;