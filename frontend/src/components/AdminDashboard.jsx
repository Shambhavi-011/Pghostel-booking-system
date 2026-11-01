import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MEERUT_LOCATIONS = [
  { name: 'MIET College (NH-58 Baghpat Bypass)', lat: 28.9734, lng: 77.6394, locality: 'Baghpat Road / NH-58' },
  { name: 'Subharti University (NH-58)', lat: 28.9882, lng: 77.6433, locality: 'Subharti Campus' },
  { name: 'Modipuram', lat: 29.0664, lng: 77.7126, locality: 'Modipuram' },
  { name: 'Sharda Road / Brahmpuri', lat: 28.9740, lng: 77.6980, locality: 'Sharda Road' },
  { name: 'Shastri Nagar', lat: 28.9667, lng: 77.7291, locality: 'Shastri Nagar' },
  { name: 'University Road / CCSU', lat: 28.9712, lng: 77.7410, locality: 'CCSU Campus' },
];

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Form State with all PG attributes
  const [formData, setFormData] = useState({
    pgName: '',
    city: 'Meerut',
    locality: '',
    gender: 'Boys',
    price: 6000,
    bedSharing: 'Twin / double',
    roomType: 'Twin / double',
    ac: 'Yes',
    wifi: 'Yes',
    meal: 'Yes',
    mealsIncluded: 'Yes',
    laundry: 'Yes',
    foodType: 'Pure Veg',
    water: '24/7 RO Drinking Water',
    electricity: 'Included in Rent',
    security: 'CCTV & Security Guard',
    parking: 'Yes',
    powerBackup: 'Yes',
    overallRating: 4.5,
    reviewCount: '15 reviews',
    reviewsComments: 'Clean rooms, quiet study atmosphere, and hygienic food.',
    photoUrl: 'https://pgdekhoprod.s3.amazonaws.com/pgDekhoWeb/IMG-20250719-WA0144.jpg',
    latitude: 28.9734,
    longitude: 77.6394,
    googleMapsSearch: 'https://maps.google.com/?q=Meerut+PG',
  });

  const fetchProperties = async () => {
    try {
      const res = await axios.get('/api/properties');
      setProperties(res.data || []);
    } catch (err) {
      console.error('Failed to fetch properties:', err);
      setToast({ type: 'error', message: 'Could not fetch properties list.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'bedSharing' ? { roomType: value } : {}),
      ...(name === 'meal' ? { mealsIncluded: value } : {}),
    }));
  };

  const handleLocationPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      locality: preset.locality,
      latitude: preset.lat,
      longitude: preset.lng,
      googleMapsSearch: `https://maps.google.com/?q=${encodeURIComponent(preset.name + ', Meerut')}`,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.pgName.trim()) {
      setToast({ type: 'error', message: 'Please enter a PG Name.' });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        overallRating: Number(formData.overallRating),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
      };

      await axios.post('/api/properties/add', payload);

      setToast({ type: 'success', message: `🎉 "${formData.pgName}" added successfully to AlgoRooms!` });
      // Reset form
      setFormData((prev) => ({
        ...prev,
        pgName: '',
        locality: '',
        price: 6000,
        reviewsComments: '',
      }));
      await fetchProperties();
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Failed to add property. Check backend.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ maxWidth: '1150px', margin: '30px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: toast.type === 'error' ? '#c0392b' : '#27ae60',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 9999,
            fontWeight: 'bold',
          }}
        >
          {toast.message}
          <button
            onClick={() => setToast(null)}
            style={{ marginLeft: '15px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Admin Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '25px', borderBottom: '2px solid #e6d9ef', paddingBottom: '15px' }}>
        <div>
          <h1 style={{ color: '#4a3b52', margin: '0 0 5px 0' }}>🛠️ Admin Management Portal</h1>
          <p style={{ color: '#786d84', margin: 0 }}>
            Add new PGs/Hostels with full amenities, reviews, and GPS coordinates for AI matching and map display.
          </p>
        </div>
        <div style={{ background: '#f4eff7', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', color: '#80608f' }}>
          📊 Total PGs in System: {properties.length}
        </div>
      </div>

      {/* ADD NEW PG FORM */}
      <div style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 8px 25px rgba(128, 96, 143, 0.1)', border: '1px solid #e6d9ef', marginBottom: '40px' }}>
        <h2 style={{ color: '#80608f', marginTop: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          ➕ Add New PG / Hostel Listing
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Basic Information */}
          <h3 style={{ color: '#4a3b52', fontSize: '1.1rem', borderBottom: '1px solid #f0e6f6', paddingBottom: '6px', marginBottom: '15px' }}>
            1. Basic PG Details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', color: '#555', marginBottom: '6px' }}>PG / Hostel Name *</label>
              <input
                type="text"
                name="pgName"
                placeholder="e.g. Krishna Boys Residency"
                required
                value={formData.pgName}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d5c8de', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', color: '#555', marginBottom: '6px' }}>Type of PG (Gender) *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d5c8de', boxSizing: 'border-box' }}
              >
                <option value="Boys">Boys PG / Hostel</option>
                <option value="Girls">Girls PG / Hostel</option>
                <option value="Co-ed">Co-ed / All Welcome</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', color: '#555', marginBottom: '6px' }}>City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d5c8de', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', color: '#555', marginBottom: '6px' }}>Area / Locality *</label>
              <input
                type="text"
                name="locality"
                placeholder="e.g. Baghpat Road Near MIET"
                required
                value={formData.locality}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d5c8de', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', color: '#555', marginBottom: '6px' }}>Maximum Price (₹ / month) *</label>
              <input
                type="number"
                name="price"
                min="1000"
                max="50000"
                value={formData.price}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d5c8de', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', color: '#555', marginBottom: '6px' }}>Room / Sharing Type *</label>
              <select
                name="bedSharing"
                value={formData.bedSharing}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d5c8de', boxSizing: 'border-box' }}
              >
                <option value="Single">Single Room</option>
                <option value="Twin / double">Twin / double sharing</option>
                <option value="Triple">Triple sharing</option>
                <option value="4-Sharing">4-Sharing Dorm</option>
              </select>
            </div>
          </div>

          {/* Section 2: Amenities (Wi-Fi, Laundry, AC, Meals, etc.) */}
          <h3 style={{ color: '#4a3b52', fontSize: '1.1rem', borderBottom: '1px solid #f0e6f6', paddingBottom: '6px', marginBottom: '15px' }}>
            2. Amenities & Services
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', color: '#555', marginBottom: '6px' }}>Wi-Fi</label>
              <select name="wifi" value={formData.wifi} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d5c8de' }}>
                <option value="Yes">Yes (High Speed)</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', color: '#555', marginBottom: '6px' }}>Air Conditioning (AC)</label>
              <select name="ac" value={formData.ac} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d5c8de' }}>
                <option value="Yes">Yes (AC Room)</option>
                <option value="No">No (Non-AC)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', color: '#555', marginBottom: '6px' }}>Meals / Food</label>
              <select name="meal" value={formData.meal} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d5c8de' }}>
                <option value="Yes">Included (Breakfast, Lunch, Dinner)</option>
                <option value="No">Not Included</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', color: '#555', marginBottom: '6px' }}>Laundry</label>
              <select name="laundry" value={formData.laundry} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d5c8de' }}>
                <option value="Yes">Yes (Washing Machine / Service)</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', color: '#555', marginBottom: '6px' }}>Food Type</label>
              <select name="foodType" value={formData.foodType} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d5c8de' }}>
                <option value="Pure Veg">Pure Veg</option>
                <option value="Veg & Non-Veg">Veg & Non-Veg</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', color: '#555', marginBottom: '6px' }}>Power Backup</label>
              <select name="powerBackup" value={formData.powerBackup} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d5c8de' }}>
                <option value="Yes">Yes (Inverter / Generator)</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          {/* Section 3: Reviews & Ratings */}
          <h3 style={{ color: '#4a3b52', fontSize: '1.1rem', borderBottom: '1px solid #f0e6f6', paddingBottom: '6px', marginBottom: '15px' }}>
            3. Reviews & Ratings Details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', color: '#555', marginBottom: '6px' }}>Overall Rating (out of 5)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                name="overallRating"
                value={formData.overallRating}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d5c8de' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', color: '#555', marginBottom: '6px' }}>Review Count</label>
              <input
                type="text"
                name="reviewCount"
                placeholder="e.g. 25 reviews"
                value={formData.reviewCount}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d5c8de' }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontWeight: 'bold', color: '#555', marginBottom: '6px' }}>Reviews & Student Comments</label>
              <textarea
                name="reviewsComments"
                rows="2"
                placeholder="What students say about this PG (food quality, owner behavior, Wi-Fi speed, distance to college)..."
                value={formData.reviewsComments}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d5c8de', fontFamily: 'inherit' }}
              />
            </div>
          </div>

          {/* Section 4: AI Matches & Show on Map (Coordinates & Photo) */}
          <h3 style={{ color: '#4a3b52', fontSize: '1.1rem', borderBottom: '1px solid #f0e6f6', paddingBottom: '6px', marginBottom: '15px' }}>
            4. AI Matches & Show on Map (Location Coordinates)
          </h3>

          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#786d84', fontWeight: 'bold', marginRight: '8px' }}>
              📍 Quick Meerut Landmarks (Click to auto-set coords):
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
              {MEERUT_LOCATIONS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleLocationPreset(preset)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '15px',
                    border: '1px solid #af87c8',
                    background: formData.locality === preset.locality ? '#af87c8' : '#fcfaff',
                    color: formData.locality === preset.locality ? 'white' : '#80608f',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '25px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', color: '#555', marginBottom: '6px' }}>Latitude</label>
              <input
                type="number"
                step="0.0001"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d5c8de' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', color: '#555', marginBottom: '6px' }}>Longitude</label>
              <input
                type="number"
                step="0.0001"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d5c8de' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', color: '#555', marginBottom: '6px' }}>Photo URL (or sample name)</label>
              <input
                type="text"
                name="photoUrl"
                placeholder="https://pgdekhoprod.s3.amazonaws.com/pgDekhoWeb/IMG-20250719-WA0144.jpg"
                value={formData.photoUrl}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d5c8de' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '14px 30px',
              backgroundColor: '#80608f',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(128, 96, 143, 0.3)',
              width: '100%',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#624670')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#80608f')}
          >
            {submitting ? 'Adding PG to System...' : '✨ Publish & Add PG to SpaceMatch'}
          </button>
        </form>
      </div>

      {/* SECTION: EXISTING PGS TABLE / CARDS */}
      <div>
        <h2 style={{ color: '#4a3b52', borderBottom: '2px solid #e6d9ef', paddingBottom: '10px' }}>
          🏡 Currently Listed PGs ({properties.length})
        </h2>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#888' }}>Loading existing PGs...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {properties.map((p) => (
              <div
                key={p.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #e6d9ef',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ margin: '0 0 5px 0', color: '#4a3b52' }}>{p.pgName || 'PG Stay'}</h3>
                    <span style={{ background: '#f4eff7', color: '#80608f', padding: '3px 8px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {p.gender || 'Any'}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '0.9rem' }}>
                    📍 {[p.locality, p.city].filter(Boolean).join(', ') || 'Meerut'}
                  </p>
                  <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#80608f', fontSize: '1.1rem' }}>
                    ₹{p.price ? Number(p.price).toLocaleString('en-IN') : 'N/A'} / month
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                    <span style={{ background: '#e8f8f5', color: '#27ae60', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>Sharing: {p.bedSharing || 'Twin'}</span>
                    <span style={{ background: '#fef9e7', color: '#f39c12', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>⭐ {p.overallRating || '4.0'}</span>
                    {p.wifi && <span style={{ background: '#ebf5fb', color: '#2980b9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>Wi-Fi</span>}
                    {p.ac && <span style={{ background: '#ebf5fb', color: '#2980b9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>AC</span>}
                    {p.meal && <span style={{ background: '#ebf5fb', color: '#2980b9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>Food</span>}
                  </div>
                  {p.reviewsComments && (
                    <p style={{ margin: '0', color: '#777', fontStyle: 'italic', fontSize: '0.85rem' }}>
                      "{p.reviewsComments.slice(0, 85)}..."
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminDashboard;

