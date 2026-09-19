import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/properties/all');
        setProperties(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load properties.');
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // YEH NAYA FUNCTION HAI BOOKING KE LIYE
  const handleBook = async (propertyId, pgName) => {
    try {
      // Abhi ke liye hum dummy tenantId '2' bhej rahe hain. 
      const response = await axios.post('http://localhost:8080/api/bookings/request', {
        propertyId: propertyId,
        tenantId: 2 
      });
      alert(`Badhai ho! Aapki ${pgName} ki booking request chali gayi hai.\nStatus: ${response.data.status}`);
    } catch (err) {
      alert('Error: Booking nahi ho payi. Backend check karein.');
    }
  };

  if (loading) return <p style={{ textAlign: 'center' }}>Loading properties...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  return (
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ color: '#80608f', textAlign: 'center', fontSize: '2rem', marginBottom: '20px' }}>
        Available PGs & Hostels
      </h3>
      
      {properties.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No properties found. Add some from the backend!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {properties.map((pg) => (
            <div key={pg.id} style={{ 
              border: '1px solid #e6d9ef', borderRadius: '8px', padding: '15px', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#4a4a4a', fontSize: '1.2rem' }}>{pg.pgName}</h4>
              <p style={{ margin: '5px 0' }}><strong>City:</strong> {pg.city}</p>
              <p style={{ margin: '5px 0' }}><strong>Rent:</strong> ₹{pg.rent}/month</p>
              <p style={{ margin: '5px 0' }}><strong>AC:</strong> {pg.hasAc ? 'Yes' : 'No'}</p>
              <p style={{ margin: '5px 0' }}><strong>Sharing:</strong> {pg.sharingType} Person</p>
              <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>{pg.description}</p>
              
              {/* BUTTON MEIN ONCLICK ADD KIYA HAI */}
              <button 
                onClick={() => handleBook(pg.id, pg.pgName)}
                style={{ 
                  marginTop: '15px', padding: '10px 15px', backgroundColor: '#80608f', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', width: '100%', fontWeight: 'bold'
              }}>
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyList;