import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedPg, setSelectedPg] = useState(null); 
  const [showBookingForm, setShowBookingForm] = useState(false); 
  
  const [studentData, setStudentData] = useState({
    name: '', phone: '', address: '', occupation: 'Student', 
    collegeName: '', course: '', fatherName: '', motherName: '', parentPhone: ''
  });

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

  const handleInputChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    try {
      // VIVA HACK: Student details ke sath PG ka naam bhi save kar lo
      const detailsToSave = { ...studentData, pgName: selectedPg.pgName };
      localStorage.setItem('lastBookingDetails', JSON.stringify(detailsToSave));

      const payload = {
        propertyId: selectedPg.id,
        tenantId: 2, 
        studentDetails: studentData 
      };
      
      await axios.post('http://localhost:8080/api/bookings/request', payload);
      
      alert(`✅ SUCCESS: Booking Request Sent!\nThe property owner will contact you shortly on your registered number.`);
      closeModal();
    } catch (err) {
      alert('❌ ERROR: Failed to submit booking request. Please try again later.');
    }
  };
  const closeModal = () => {
    setSelectedPg(null);
    setShowBookingForm(false);
  };

  const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d5c8de', boxSizing: 'border-box', marginBottom: '12px', outline: 'none' };
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#4a3b52', fontSize: '0.9rem' };

  if (loading) return <p style={{ textAlign: 'center' }}>Loading properties...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  return (
    <div style={{ marginTop: '20px', position: 'relative' }}>
      <h3 style={{ color: '#80608f', textAlign: 'center', fontSize: '2rem', marginBottom: '20px' }}>
        Available PGs & Hostels
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {properties.map((pg) => (
          <div key={pg.id} style={{ border: '1px solid #e6d9ef', borderRadius: '12px', padding: '15px', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ height: '150px', backgroundColor: '#f4eff7', borderRadius: '8px', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#af87c8', fontWeight: 'bold' }}>
              📸 Property Image
            </div>
            <h4 style={{ margin: '0 0 10px 0', color: '#4a4a4a', fontSize: '1.2rem' }}>{pg.pgName}</h4>
            <p style={{ margin: '5px 0' }}>📍 {pg.city}</p>
            <p style={{ margin: '5px 0' }}>💰 ₹{pg.rent}/month</p>
            <button onClick={() => setSelectedPg(pg)} style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e6d9ef', color: '#4a3b52', border: 'none', borderRadius: '6px', width: '100%', fontWeight: 'bold', cursor: 'pointer' }}>
              View Details & Book
            </button>
          </div>
        ))}
      </div>

      {/* POPUP MODAL */}
      {selectedPg && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px', boxSizing: 'border-box' }}>
          
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '16px', padding: '30px', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            
            <button onClick={closeModal} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#80608f' }}>✖</button>

            {!showBookingForm ? (
              // VIEW 1: DETAILS
              <div>
                <h2 style={{ color: '#4a3b52', marginTop: 0, fontSize: '1.8rem' }}>{selectedPg.pgName}</h2>
                <div style={{ height: '200px', backgroundColor: '#e6d9ef', borderRadius: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#af87c8' }}>
                  [ Beautiful PG Image Gallery Here ]
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div style={{ background: '#f4eff7', padding: '15px', borderRadius: '8px' }}>
                    <p style={{ margin: 0, fontSize: '1.1rem' }}><strong>Rent:</strong> ₹{selectedPg.rent}/mo</p>
                  </div>
                  <div style={{ background: '#f4eff7', padding: '15px', borderRadius: '8px' }}>
                    <p style={{ margin: 0, fontSize: '1.1rem' }}><strong>Sharing:</strong> {selectedPg.sharingType} Seater</p>
                  </div>
                </div>

                <h4 style={{ borderBottom: '2px solid #e6d9ef', paddingBottom: '8px', color: '#4a3b52' }}>🌟 Amenities</h4>
                <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', color: '#555' }}>
                  <li>✅ {selectedPg.hasAc ? 'Air Conditioned' : 'Non-AC Room'}</li>
                  <li>✅ Free High-Speed WiFi</li>
                  <li>✅ 3 Meals (Mess)</li>
                  <li>✅ Laundry Service</li>
                  <li>✅ Attached Washroom</li>
                  <li>✅ 24/7 Power Backup</li>
                </ul>

                <h4 style={{ borderBottom: '2px solid #e6d9ef', paddingBottom: '8px', marginTop: '25px', color: '#4a3b52' }}>📍 Map Location Preview</h4>
                <div style={{ height: '120px', background: '#e0e0e0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px', color: '#666' }}>
                  🗺️ {selectedPg.city} Map Preview
                </div>

                <button onClick={() => setShowBookingForm(true)} style={{ width: '100%', padding: '15px', backgroundColor: '#80608f', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  Proceed to Book
                </button>
              </div>

            ) : (
              // VIEW 2: BOOKING FORM
              <div>
                <h2 style={{ color: '#4a3b52', marginTop: 0 }}>Booking Application</h2>
                <p style={{ color: '#666', marginBottom: '20px' }}>Fill your details for <b>{selectedPg.pgName}</b></p>
                
                <form onSubmit={submitBooking}>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" name="name" value={studentData.name} onChange={handleInputChange} required style={inputStyle} />
                  
                  <label style={labelStyle}>Phone Number</label>
                  <input type="tel" name="phone" value={studentData.phone} onChange={handleInputChange} required style={inputStyle} />
                  
                  <label style={labelStyle}>Permanent Address</label>
                  <textarea name="address" rows="3" value={studentData.address} onChange={handleInputChange} required style={inputStyle} />

                  <label style={labelStyle}>Current Status</label>
                  <select name="occupation" value={studentData.occupation} onChange={handleInputChange} style={inputStyle}>
                    <option value="Student">Student</option>
                    <option value="Job/Other">Job / Working Professional</option>
                  </select>

                  {studentData.occupation === 'Student' && (
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>College Name</label>
                        <input type="text" name="collegeName" value={studentData.collegeName} onChange={handleInputChange} required style={inputStyle} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={labelStyle}>Course</label>
                        <input type="text" name="course" value={studentData.course} onChange={handleInputChange} required style={inputStyle} />
                      </div>
                    </div>
                  )}

                  <h4 style={{ borderBottom: '2px solid #e6d9ef', paddingBottom: '8px', marginTop: '15px', color: '#4a3b52' }}>Parents / Guardian Details</h4>
                  
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>Father's Name</label>
                      <input type="text" name="fatherName" value={studentData.fatherName} onChange={handleInputChange} required style={inputStyle} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>Mother's Name</label>
                      <input type="text" name="motherName" value={studentData.motherName} onChange={handleInputChange} style={inputStyle} />
                    </div>
                  </div>

                  <label style={labelStyle}>Parent Phone Number</label>
                  <input type="tel" name="parentPhone" value={studentData.parentPhone} onChange={handleInputChange} required style={inputStyle} />

                  <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                    <button type="button" onClick={() => setShowBookingForm(false)} style={{ flex: 1, padding: '14px', backgroundColor: '#e6d9ef', color: '#4a3b52', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                      Back
                    </button>
                    <button type="submit" style={{ flex: 2, padding: '14px', backgroundColor: '#80608f', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      Confirm Booking
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyList;