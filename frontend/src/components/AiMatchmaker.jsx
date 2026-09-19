import React, { useState } from 'react';
import axios from 'axios';

const AiMatchmaker = () => {
  const [formData, setFormData] = useState({
    city: 'Meerut', // Default city
    rent: 6000,
    distance: 5,
    sharing_type: 2,
    has_ac: 0
  });

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.name === 'city' ? e.target.value : Number(e.target.value);
    setFormData({ ...formData, [e.target.name]: value });
  };

  const findMatch = async () => {
    setLoading(true);
    setError('');
    try {
      // Data ab backend ko jayega jisme city bhi shamil hai
      const response = await axios.post('http://localhost:8080/api/ai/recommend', formData);
      setRecommendations(response.data.recommendations);
    } catch (err) {
      setError('AI Engine se connect nahi ho paya.');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: "linear-gradient(135deg, #80608f 0%, #4a3b52 100%)", borderRadius: "16px", padding: "30px", color: "white", marginBottom: "40px" }}>
      <h2 style={{ margin: "0 0 20px 0", fontSize: "1.8rem" }}>✨ AI Matchmaker</h2>
      
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '20px' }}>
        
        {/* NAYA CITY DROPDOWN */}
        <div style={{ flex: '1', minWidth: '150px' }}>
          <label>Select City</label>
          <select name="city" value={formData.city} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px' }}>
            <option value="Meerut">Meerut (MIET)</option>
            <option value="Noida">Noida</option>
            <option value="Ghaziabad">Ghaziabad</option>
          </select>
        </div>

        <div style={{ flex: '1', minWidth: '150px' }}>
          <label>Max Rent (₹)</label>
          <input type="number" name="rent" value={formData.rent} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px' }} />
        </div>
        <div style={{ flex: '1', minWidth: '150px' }}>
          <label>Distance (km)</label>
          <input type="number" step="0.5" name="distance" value={formData.distance} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px' }} />
        </div>
        <div style={{ flex: '1', minWidth: '150px' }}>
          <label>Sharing (1/2/3)</label>
          <input type="number" name="sharing_type" value={formData.sharing_type} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px' }} />
        </div>
        <div style={{ flex: '1', minWidth: '150px' }}>
          <label>AC Needed?</label>
          <select name="has_ac" value={formData.has_ac} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px' }}>
            <option value={1}>Yes (AC)</option>
            <option value={0}>No (Non-AC)</option>
          </select>
        </div>
      </div>

      <button onClick={findMatch} disabled={loading} style={{ padding: "12px 24px", fontSize: "1.1rem", backgroundColor: "white", color: "#4a3b52", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", width: "100%" }}>
        {loading ? 'Finding Best Matches...' : 'Find My Match'}
      </button>

      {error && <p style={{ color: '#ffb74d', marginTop: '15px' }}>{error}</p>}
    </div>
  );
};

export default AiMatchmaker;