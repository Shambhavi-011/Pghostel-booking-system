import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OwnerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Abhi test karne ke liye hum Owner ID 1 use kar rahe hain.
  // Baad mein yeh Login wale user ki ID hogi.
  const ownerId = 1;

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/bookings/owner/${ownerId}`);
      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching requests', error);
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/bookings/${bookingId}/status?status=${newStatus}`);
      alert(`Booking has been ${newStatus}!`);
      fetchRequests(); // Status update hone ke baad list refresh karein
    } catch (error) {
      alert('Error updating status. Is backend running?');
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading requests...</p>;

  return (
    <div style={{ padding: "40px 20px", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "#4a3b52", borderBottom: "2px solid #e6d9ef", paddingBottom: "10px" }}>
        🏠 Owner Dashboard
      </h2>
      <p style={{ color: "#786d84", marginBottom: "30px" }}>Manage your PG booking requests here.</p>

      {requests.length === 0 ? (
        <div style={{ padding: "30px", background: "#fff", borderRadius: "8px", border: "1px solid #e6d9ef", textAlign: "center" }}>
          No booking requests yet.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {requests.map((req) => (
            <div key={req.id} style={{ 
              display: "flex", justifyContent: "space-between", alignItems: "center", 
              background: "#fff", padding: "20px", borderRadius: "8px", 
              borderLeft: req.status === 'PENDING' ? "5px solid #ffb74d" : (req.status === 'CONFIRMED' ? "5px solid #4CAF50" : "5px solid #F44336"),
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
            }}>
              <div>
                <h4 style={{ margin: "0 0 5px 0" }}>Property ID: {req.propertyId}</h4>
                <p style={{ margin: "0 0 5px 0", color: "#666" }}>Requested by Tenant ID: {req.tenantId}</p>
                <p style={{ margin: 0, fontWeight: "bold", color: req.status === 'PENDING' ? '#ff9800' : (req.status === 'CONFIRMED' ? '#4CAF50' : '#F44336') }}>
                  Status: {req.status}
                </p>
              </div>

              {req.status === 'PENDING' && (
                <div style={{ display: "flex", gap: "10px" }}>
                  <button 
                    onClick={() => updateStatus(req.id, 'CONFIRMED')}
                    style={{ padding: "8px 15px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                    Approve ✓
                  </button>
                  <button 
                    onClick={() => updateStatus(req.id, 'REJECTED')}
                    style={{ padding: "8px 15px", backgroundColor: "#F44336", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                    Reject ✕
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;