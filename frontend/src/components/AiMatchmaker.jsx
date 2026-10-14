import React, { useState } from 'react';
import axios from 'axios';

const cityCenters = {
  Meerut: { lat: 28.9845, lng: 77.7064 },
  Noida: { lat: 28.5355, lng: 77.391 },
  Ghaziabad: { lat: 28.6692, lng: 77.4538 },
};

const AiMatchmaker = ({ onRecommendations, onLocationFound }) => {
  const [formData, setFormData] = useState({
    city: 'Meerut',
    area: '',
    maxPrice: 6000,
    bedSharing: 2,
    ac: 0,
    wifi: 0,
    meal: 0,
    laundry: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: name === 'city' || name === 'area' ? value : Number(value),
    }));
  };

  const findMatch = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: properties } = await axios.get('/api/properties/all');
      if (!Array.isArray(properties)) {
        throw new Error('The property API returned an invalid response.');
      }

      const payload = {
        city: formData.city,
        area: formData.area.trim(),
        max_price: formData.maxPrice || null,
        price: formData.maxPrice || null,
        bed_sharing: formData.bedSharing,
        sharing_type: formData.bedSharing,
        ac: formData.ac,
        has_ac: formData.ac,
        wifi: formData.wifi,
        meal: formData.meal,
        mess: formData.meal,
        laundry: formData.laundry,
        properties,
      };
      const aiUrl = process.env.REACT_APP_AI_API_URL || 'http://localhost:8000/recommend-pg';
      const { data } = await axios.post(aiUrl, payload);
      const matches = data.recommendations || data.top_recommendations;
      if (!Array.isArray(matches)) {
        throw new Error(data.error || 'The AI service returned an invalid response.');
      }

      onRecommendations(matches);

      const center = cityCenters[formData.city] || cityCenters.Meerut;
      let mapLocation = { ...center, name: formData.area.trim() || formData.city };
      if (formData.area.trim()) {
        try {
          const geoResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: { format: 'jsonv2', limit: 1, q: `${formData.area}, ${formData.city}` },
          });
          if (geoResponse.data?.[0]) {
            mapLocation = {
              lat: Number(geoResponse.data[0].lat),
              lng: Number(geoResponse.data[0].lon),
              name: formData.area.trim(),
            };
          }
        } catch (geocodingError) {
          console.warn('Could not geocode the requested area; showing property pins instead.', geocodingError);
        }
      }
      onLocationFound(mapLocation);
      if (matches.length === 0) {
        setError('No matching PGs found. Try another area or relax your filters.');
      }
    } catch (requestError) {
      console.error('AI property search failed:', requestError);
      const errorMessage = requestError.response?.data?.detail
        || requestError.response?.data?.error
        || requestError.message
        || 'Could not get AI recommendations. Check that the backend and AI service are running.';
      setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      onRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: 'none',
    borderRadius: '8px',
    color: '#333',
    boxSizing: 'border-box',
  };

  const fieldStyle = { flex: '1 1 160px', minWidth: '140px' };
  const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.95rem' };

  return (
    <form
      onSubmit={findMatch}
      style={{
        background: 'linear-gradient(135deg, #80608f 0%, #4a3b52 100%)',
        borderRadius: '16px',
        padding: '30px',
        color: 'white',
        marginBottom: '40px',
      }}
    >
      <h2 style={{ margin: '0 0 25px', fontSize: '1.8rem' }}>✨ AI Matchmaker</h2>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div style={fieldStyle}>
          <label htmlFor="match-city" style={labelStyle}>City</label>
          <select id="match-city" name="city" value={formData.city} onChange={handleChange} style={inputStyle}>
            {Object.keys(cityCenters).map((city) => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>
        <div style={{ ...fieldStyle, flexGrow: 2 }}>
          <label htmlFor="match-area" style={labelStyle}>Area</label>
          <input id="match-area" name="area" placeholder="Optional area or locality" value={formData.area} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={fieldStyle}>
          <label htmlFor="match-max-price" style={labelStyle}>Maximum price (₹ / month)</label>
          <input id="match-max-price" name="maxPrice" type="number" min="0" value={formData.maxPrice} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={fieldStyle}>
          <label htmlFor="match-sharing" style={labelStyle}>Sharing</label>
          <select id="match-sharing" name="bedSharing" value={formData.bedSharing} onChange={handleChange} style={inputStyle}>
            <option value={1}>Single</option>
            <option value={2}>Twin / double</option>
            <option value={3}>Triple</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '25px' }}>
        {[
          ['ac', 'AC required?'],
          ['wifi', 'Wi-Fi required?'],
          ['meal', 'Meals required?'],
          ['laundry', 'Laundry required?'],
        ].map(([name, label]) => (
          <div key={name} style={fieldStyle}>
            <label htmlFor={`match-${name}`} style={labelStyle}>{label}</label>
            <select id={`match-${name}`} name={name} value={formData[name]} onChange={handleChange} style={inputStyle}>
              <option value={0}>No preference</option>
              <option value={1}>Required</option>
            </select>
          </div>
        ))}
      </div>
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '14px 24px',
          backgroundColor: 'white',
          color: '#4a3b52',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1.05rem',
          fontWeight: 'bold',
          width: '100%',
        }}
      >
        {loading ? 'Finding matches...' : 'Find AI Matches & Show on Map'}
      </button>
      {error && <p role="status" style={{ color: '#ffe0b2', marginTop: '15px', textAlign: 'center' }}>{error}</p>}
    </form>
  );
};

export default AiMatchmaker;
