import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MapComponent from './components/MapComponent';
import RentPredictor from './components/rent-predictor/RentPredictor';
import Login from './components/Login'; 

// Ye tumhara Home Page hai jisme saara naya design aur tools hain
const Home = () => (
  <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
    <h1 style={{ color: "#786d84", textAlign: "center" }}>Find Your Perfect Student Stay</h1>
    
    <RentPredictor />

    <hr style={{ margin: "40px 0", border: "1px solid #e6d9ef" }} />

    <h3 style={{ color: "#80608f" }}>Explore Campus Vicinity (Near MIET)</h3>
    <MapComponent 
      lat={28.9731} 
      lng={77.6402} 
      pgName="Sunrise Girls Hostel" 
      rent={8500} 
    />
  </div>
);

function App() {
  return (
    <Router>
      <div style={{ backgroundColor: "#faf8fc", minHeight: "100vh" }}>
        {/* Navbar hamesha top par rahega */}
        <Navbar />

        {/* Routes decide karenge ki screen par kya dikhana hai */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;