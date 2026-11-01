import React, { useState } from 'react';
import axios from 'axios';
import { CATALOG_PROPERTIES } from '../data';

const cityCenters = {
  Meerut: { lat: 28.9845, lng: 77.7064 },
  Noida: { lat: 28.5355, lng: 77.391 },
  Ghaziabad: { lat: 28.6692, lng: 77.4538 },
};

const hasAmenityValue = (val) => {
  if (val === true || val === 1) return true;
  if (!val) return false;
  return ['yes', 'true', 'available', 'included'].includes(String(val).trim().toLowerCase());
};

const calculateMatch = (property, prefs) => {
  let score = 0;

  // 1. Gender / PG Type Match (Weight: 25%)
  const propGender = (property.gender || '').trim().toLowerCase();
  const reqGender = (prefs.gender || 'all').toLowerCase();

  if (reqGender === 'all') {
    score += 25;
  } else if (reqGender === 'boys') {
    if (propGender.includes('boy')) {
      score += 25;
    } else if (propGender.includes('co') || propGender.includes('all')) {
      score += 18;
    } else {
      score += 0; // Incompatible with Boys PG request
    }
  } else if (reqGender === 'girls') {
    if (propGender.includes('girl')) {
      score += 25;
    } else if (propGender.includes('co') || propGender.includes('all')) {
      score += 18;
    } else {
      score += 0; // Incompatible with Girls PG request
    }
  } else if (reqGender === 'coed') {
    if (propGender.includes('co') || propGender.includes('all')) {
      score += 25;
    } else {
      score += 12;
    }
  }

  // 2. Budget / Max Price Match (Weight: 25%)
  const propPrice = Number(property.price || property.rent || 0);
  const maxPrice = Number(prefs.maxPrice || 0);
  if (!maxPrice || propPrice <= maxPrice) {
    score += 25;
  } else {
    const overBudget = propPrice - maxPrice;
    const penaltyRatio = Math.min(1, overBudget / maxPrice);
    score += Math.max(0, Math.round(25 * (1 - penaltyRatio)));
  }

  // 3. Sharing Type Match (Weight: 20%)
  const propSharingRaw = String(property.bedSharing || property.roomType || '').toLowerCase();
  const reqSharing = Number(prefs.bedSharing || 2);
  let propSharing = 2;
  if (propSharingRaw.includes('single') || propSharingRaw.includes('1')) propSharing = 1;
  else if (propSharingRaw.includes('twin') || propSharingRaw.includes('double') || propSharingRaw.includes('2')) propSharing = 2;
  else if (propSharingRaw.includes('triple') || propSharingRaw.includes('3')) propSharing = 3;
  else if (propSharingRaw.includes('4') || propSharingRaw.includes('quad')) propSharing = 4;

  const sharingDiff = Math.abs(propSharing - reqSharing);
  if (sharingDiff === 0) score += 20;
  else if (sharingDiff === 1) score += 12;
  else score += 5;

  // 4. Amenities Match (Weight: 20% - 5% each)
  // AC
  if (prefs.ac) {
    if (hasAmenityValue(property.ac)) score += 5;
  } else {
    score += 5;
  }

  // Wi-Fi
  if (prefs.wifi) {
    if (hasAmenityValue(property.wifi)) score += 5;
  } else {
    score += 5;
  }

  // Meals
  if (prefs.meal) {
    if (hasAmenityValue(property.mealsIncluded || property.meal || property.foodType)) score += 5;
  } else {
    score += 5;
  }

  // Laundry
  if (prefs.laundry) {
    if (hasAmenityValue(property.laundry)) score += 5;
  } else {
    score += 5;
  }

  // 5. Area / Locality Match (Weight: 10%)
  const reqArea = (prefs.area || '').trim().toLowerCase();
  const propLocality = (property.locality || '').toLowerCase();
  const propName = (property.pgName || '').toLowerCase();
  if (reqArea) {
    if (propLocality.includes(reqArea) || propName.includes(reqArea)) {
      score += 10;
    } else {
      score += 3;
    }
  } else {
    score += 10;
  }

  return Math.min(99, Math.max(25, Math.round(score)));
};

const calculateClientMatch = calculateMatch;

const AiMatchmaker = ({ onRecommendations, onLocationFound }) => {
  const [formData, setFormData] = useState({
    city: 'Meerut',
    area: '',
    gender: 'all', // 'all', 'boys', 'girls', 'coed'
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
      [name]: name === 'city' || name === 'area' || name === 'gender' ? value : Number(value),
    }));
  };

  const findMatch = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      let properties = [];
      try {
        const { data } = await axios.get('/api/properties/all', { timeout: 2500 });
        if (Array.isArray(data) && data.length > 0) {
          properties = data;
        } else {
          properties = CATALOG_PROPERTIES;
        }
      } catch (backendFetchErr) {
        console.info('Backend unreachable or offline; using verified PGdekho properties catalog.', backendFetchErr);
        properties = CATALOG_PROPERTIES;
      }

      let matches = [];

      // 1. Try hitting the Python AI Microservice first if available
      try {
        const payload = {
          city: formData.city,
          area: formData.area.trim(),
          gender: formData.gender,
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
        const aiResponse = await axios.post(aiUrl, payload, { timeout: 2000 });
        const aiMatches = aiResponse.data?.recommendations || aiResponse.data?.top_recommendations;
        if (Array.isArray(aiMatches) && aiMatches.length > 0) {
          matches = aiMatches;
        }
      } catch (aiErr) {
        console.info('Python AI microservice offline; using intelligent client-side recommender engine.');
      }

      // 2. Client-side scoring if Python AI returned empty or is offline
      if (matches.length === 0) {
        const reqCity = (formData.city || '').toLowerCase();
        const reqArea = (formData.area || '').trim().toLowerCase();
        const reqGender = (formData.gender || 'all').toLowerCase();

        matches = properties
          .filter((p) => {
            // City check
            if (reqCity && (p.city || '').toLowerCase() !== reqCity) return false;

            // Strict gender incompatibility check
            const propGender = (p.gender || '').toLowerCase();
            if (reqGender === 'boys' && propGender.includes('girl') && !propGender.includes('co')) return false;
            if (reqGender === 'girls' && propGender.includes('boy') && !propGender.includes('co')) return false;
            if (reqGender === 'coed' && !propGender.includes('co') && !propGender.includes('all')) return false;

            return true;
          })
          .map((p) => {
            const score = calculateMatch(p, formData);
            return {
              ...p,
              matchPercentage: `${score}%`,
              matchScoreNum: score,
            };
          });

        // Sort descending by match percentage score
        matches.sort((a, b) => b.matchScoreNum - a.matchScoreNum);
      } else {
        // If results came from Python AI, adjust/enhance with the gender score
        matches = matches.map((m) => {
          const score = calculateMatch(m, formData);
          return {
            ...m,
            matchPercentage: `${score}%`,
            matchScoreNum: score,
          };
        }).sort((a, b) => b.matchScoreNum - a.matchScoreNum);
      }

      onRecommendations(matches);

      const center = cityCenters[formData.city] || cityCenters.Meerut;
      let mapLocation = { ...center, name: formData.area.trim() || formData.city };
      if (formData.area.trim()) {
        try {
          const geoResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: { format: 'jsonv2', limit: 1, q: `${formData.area}, ${formData.city}` },
            timeout: 2000,
          });
          if (geoResponse.data?.[0]) {
            mapLocation = {
              lat: Number(geoResponse.data[0].lat),
              lng: Number(geoResponse.data[0].lon),
              name: formData.area.trim(),
            };
          }
        } catch (geocodingError) {
          console.warn('Could not geocode the requested area; showing property pins instead.');
        }
      }
      onLocationFound(mapLocation);

      if (matches.length === 0) {
        setError('No matching PGs found for this combination. Try relaxing your budget or living type preference.');
      }
    } catch (searchError) {
      console.error('AI matchmaker fallback execution:', searchError);
      // Fallback directly to catalog properties without throwing an error
      const safeFallback = CATALOG_PROPERTIES.map((p) => {
        const score = calculateMatch(p, formData);
        return {
          ...p,
          matchPercentage: `${score}%`,
          matchScoreNum: score,
        };
      }).sort((a, b) => b.matchScoreNum - a.matchScoreNum);
      onRecommendations(safeFallback);
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
    fontWeight: '500',
  };

  const fieldStyle = { flex: '1 1 160px', minWidth: '140px' };
  const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.95rem' };

  return (
    <form
      onSubmit={findMatch}
      style={{
        background: 'linear-gradient(135deg, #80608f 0%, #4a3b52 100%)',
        borderRadius: '16px',
        padding: '30px',
        color: 'white',
        marginBottom: '40px',
        boxShadow: '0 8px 25px rgba(74, 59, 82, 0.25)',
      }}
    >
      <h2 style={{ margin: '0 0 25px', fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ✨ AI Matchmaker
      </h2>

      {/* Row 1: City, Area, Living Preference, Price, Sharing */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div style={fieldStyle}>
          <label htmlFor="match-city" style={labelStyle}>City</label>
          <select id="match-city" name="city" value={formData.city} onChange={handleChange} style={inputStyle}>
            {Object.keys(cityCenters).map((city) => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>

        <div style={{ ...fieldStyle, flexGrow: 2 }}>
          <label htmlFor="match-area" style={labelStyle}>Area / Locality</label>
          <input
            id="match-area"
            name="area"
            placeholder="e.g. Baghpat Road, Subharti, NH-58"
            value={formData.area}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* NEW OPTION: Boys PG, Girls PG, or Co-ed Living */}
        <div style={fieldStyle}>
          <label htmlFor="match-gender" style={labelStyle}>Living Type (PG Preference)</label>
          <select
            id="match-gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            style={{ ...inputStyle, background: '#fdfbfd', fontWeight: 'bold', color: '#4a3b52' }}
          >
            <option value="all">Any / No preference</option>
            <option value="boys">Boys PG 👦</option>
            <option value="girls">Girls PG 👧</option>
            <option value="coed">Co-ed Living 👫</option>
          </select>
        </div>

        <div style={fieldStyle}>
          <label htmlFor="match-max-price" style={labelStyle}>Maximum price (₹ / mo)</label>
          <input
            id="match-max-price"
            name="maxPrice"
            type="number"
            min="0"
            value={formData.maxPrice}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="match-sharing" style={labelStyle}>Sharing</label>
          <select id="match-sharing" name="bedSharing" value={formData.bedSharing} onChange={handleChange} style={inputStyle}>
            <option value={1}>Single Room</option>
            <option value={2}>Twin / double</option>
            <option value={3}>Triple sharing</option>
          </select>
        </div>
      </div>

      {/* Row 2: Amenities */}
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
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transition: 'background-color 0.2s',
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = '#f7f4f9')}
        onMouseOut={(e) => (e.target.style.backgroundColor = 'white')}
      >
        {loading ? 'Finding Best AI Matches...' : '🔍 Find AI Matches & Show on Map'}
      </button>

      {error && <p role="status" style={{ color: '#ffe0b2', marginTop: '15px', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}
    </form>
  );
};

export default AiMatchmaker;
