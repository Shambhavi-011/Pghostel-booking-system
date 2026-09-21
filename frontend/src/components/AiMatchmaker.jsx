import React, { useState } from 'react';
import axios from 'axios';

const AiMatchmaker = ({ onLocationFound }) => {
  const [formData, setFormData] = useState({
    city: 'Meerut', 
    area: '', 
    rent: 6000,
    sharing_type: 2,
    has_ac: 0,
    wifi: 0,      
    mess: 0,      
    laundry: 0    
  });

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = (e.target.name === 'city' || e.target.name === 'area') ? e.target.value : Number(e.target.value);
    setFormData({ ...formData, [e.target.name]: value });
  };

  const findMatch = async () => {
    setLoading(true);
    setError('');
    try {
      const searchQuery = `${formData.area}, ${formData.city}`;
      const geoResponse = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`);
      
      let userLat = 28.9845; 
      let userLng = 77.7064;
      
      if (geoResponse.data && geoResponse.data.length > 0) {
        userLat = parseFloat(geoResponse.data[0].lat);
        userLng = parseFloat(geoResponse.data[0].lon);
        onLocationFound(userLat, userLng, formData.area || formData.city);
      } else {
        // PURE ENGLISH MAP ALERT
        alert("Exact area not found on the map. Displaying the default city center instead.");
        onLocationFound(userLat, userLng, formData.city);
      }

      const payload = { ...formData, user_lat: userLat, user_lng: userLng };
      const response = await axios.post('http://localhost:8080/api/ai/recommend', payload);
      setRecommendations(response.data.recommendations);
    } catch (err) {
      // PURE ENGLISH ERROR
      setError('Error connecting to the AI Matchmaker system. Please check your backend.');
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: '8px', 
    border: 'none', outline: 'none', boxSizing: 'border-box', color: '#333'
  };

  return (
    <div style={{ background: "linear-gradient(135deg, #80608f 0%, #4a3b52 100%)", borderRadius: "16px", padding: "30px", color: "white", marginBottom: "40px" }}>
      <h2 style={{ margin: "0 0 25px 0", fontSize: "1.8rem" }}>✨ AI Matchmaker</h2>
      
      {/* ROW 1 */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div style={{ flex: '1', minWidth: '150px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.95rem' }}>City</label>
          <select name="city" value={formData.city} onChange={handleChange} style={inputStyle}>
            <option value="Meerut">Meerut</option>
            <option value="Noida">Noida</option>
            <option value="Ghaziabad">Ghaziabad</option>
          </select>
        </div>
        <div style={{ flex: '2', minWidth: '250px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.95rem' }}>Specific Area (e.g. Sector 62, MIET)</label>
          <input type="text" name="area" placeholder="Enter area..." value={formData.area} onChange={handleChange} style={inputStyle} />
        </div>
      </div>

      {/* ROW 2 */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div style={{ flex: '1', minWidth: '120px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.95rem' }}>Max Rent (₹)</label>
          <input type="number" name="rent" value={formData.rent} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={{ flex: '1', minWidth: '120px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.95rem' }}>Sharing (1/2/3)</label>
          <input type="number" name="sharing_type" value={formData.sharing_type} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={{ flex: '1', minWidth: '120px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.95rem' }}>AC Needed?</label>
          <select name="has_ac" value={formData.has_ac} onChange={handleChange} style={inputStyle}>
            <option value={1}>Yes (AC)</option>
            <option value={0}>No (Non-AC)</option>
          </select>
        </div>
      </div>

      {/* ROW 3 (Amenities) */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '25px' }}>
        <div style={{ flex: '1', minWidth: '120px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.95rem' }}>WiFi Included?</label>
          <select name="wifi" value={formData.wifi} onChange={handleChange} style={inputStyle}>
            <option value={1}>Yes</option>
            <option value={0}>No Priority</option>
          </select>
        </div>
        <div style={{ flex: '1', minWidth: '120px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.95rem' }}>Mess / Food?</label>
          <select name="mess" value={formData.mess} onChange={handleChange} style={inputStyle}>
            <option value={1}>Yes</option>
            <option value={0}>No Priority</option>
          </select>
        </div>
        <div style={{ flex: '1', minWidth: '120px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.95rem' }}>Laundry Service?</label>
          <select name="laundry" value={formData.laundry} onChange={handleChange} style={inputStyle}>
            <option value={1}>Yes</option>
            <option value={0}>No Priority</option>
          </select>
        </div>
      </div>

      <button onClick={findMatch} disabled={loading} style={{ padding: "14px 24px", fontSize: "1.1rem", backgroundColor: "white", color: "#4a3b52", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", width: "100%", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
        {loading ? 'Searching & Mapping...' : 'Find My Match & Map Location'}
      </button>

      {error && <p style={{ color: '#ffb74d', marginTop: '15px', textAlign: 'center' }}>{error}</p>}
    </div>
  );
};

export default AiMatchmaker;