import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OwnerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedReq, setSelectedReq] = useState(null); 
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' }); 

  const ownerId = 1;

  useEffect(() => {
    fetchRequests();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

const fetchRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/bookings/owner/${ownerId}`);
      
      const savedDetails = JSON.parse(localStorage.getItem('lastBookingDetails')) || {
        name: "Rahul Kumar", phone: "+91 9876543210", address: "Sector 62, Noida", 
        occupation: "Student", collegeName: "MIET College", course: "B.Tech CSE", 
        fatherName: "Mr. R.K. Sharma", motherName: "Mrs. Sharma", parentPhone: "+91 9123456789",
        pgName: "Premium Student PG"
      };

      let enhancedRequests = response.data.map(req => ({
        ...req,
        studentDetails: savedDetails
      })).reverse();

      // NAYA FILTER: Property ID ke basis par filter karega, chahe Booking ID alag kyu na ho
      const uniqueRequests = enhancedRequests.filter((req, index, self) =>
        index === self.findIndex((t) => (
          t.propertyId === req.propertyId 
        ))
      );

      setRequests(uniqueRequests);
      setLoading(false);
    } catch (error) {
      showToast('Error fetching requests. Check your backend.', 'error');
      setLoading(false);
    }
  };
  const updateStatus = async (bookingId, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/bookings/${bookingId}/status?status=${newStatus}`);
      showToast(`Booking has been ${newStatus} successfully!`, 'success');
      fetchRequests(); 
      setSelectedReq(null); 
    } catch (error) {
      showToast('Error updating status.', 'error');
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading requests...</p>;

  return (
    <div style={{ padding: "40px 20px", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif", position: 'relative' }}>
      
      {toast.show && (
        <div style={{
          position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: toast.type === 'success' ? '#4CAF50' : '#F44336',
          color: 'white', padding: '15px 30px', borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 9999,
          fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px',
          animation: 'fadeInDown 0.4s ease-out'
        }}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.message}
        </div>
      )}

      <style>
        {`@keyframes fadeInDown { from { opacity: 0; transform: translate(-50%, -20px); } to { opacity: 1; transform: translate(-50%, 0); } }`}
      </style>

      <h2 style={{ color: "#4a3b52", borderBottom: "2px solid #e6d9ef", paddingBottom: "10px" }}>
        🏠 Owner Dashboard
      </h2>
      <p style={{ color: "#786d84", marginBottom: "30px" }}>Manage incoming PG booking requests here.</p>

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
                {/* YAHAN PG KA NAAM AUR ID DIKHEGI */}
                <h4 style={{ margin: "0 0 8px 0", color: "#4a3b52", fontSize: "1.2rem" }}>
                  🏠 {req.studentDetails.pgName} <span style={{ fontSize: "0.9rem", color: "#80608f", fontWeight: "normal" }}>(ID: {req.propertyId})</span>
                </h4>
                
                <p style={{ margin: "0 0 5px 0", fontWeight: 'bold', color: '#333' }}>👤 {req.studentDetails.name}</p>
                <p style={{ margin: "0 0 10px 0", color: "#666" }}>📞 {req.studentDetails.phone}</p>
                <p style={{ margin: 0, fontWeight: "bold", color: req.status === 'PENDING' ? '#ff9800' : (req.status === 'CONFIRMED' ? '#4CAF50' : '#F44336') }}>
                  Status: {req.status}
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button 
                  onClick={() => setSelectedReq(req)}
                  style={{ padding: "8px 15px", backgroundColor: "#80608f", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                  View Full Details
                </button>
                
                {req.status === 'PENDING' && (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button 
                      onClick={() => updateStatus(req.id, 'CONFIRMED')}
                      style={{ flex: 1, padding: "8px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                      Approve ✓
                    </button>
                    <button 
                      onClick={() => updateStatus(req.id, 'REJECTED')}
                      style={{ flex: 1, padding: "8px", backgroundColor: "#F44336", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                      Reject ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedReq && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px', boxSizing: 'border-box' }}>
          <div style={{ backgroundColor: '#fff', width: '100%', maxWidth: '500px', borderRadius: '16px', padding: '30px', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            
            <button onClick={() => setSelectedReq(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#80608f' }}>✖</button>
            
            <h2 style={{ color: '#4a3b52', marginTop: 0, borderBottom: '2px solid #e6d9ef', paddingBottom: '10px' }}>Applicant Details</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
              <div><strong style={{ color: '#666' }}>Name:</strong> <br/>{selectedReq.studentDetails.name}</div>
              <div><strong style={{ color: '#666' }}>Phone:</strong> <br/>{selectedReq.studentDetails.phone}</div>
              <div style={{ gridColumn: 'span 2' }}><strong style={{ color: '#666' }}>Address:</strong> <br/>{selectedReq.studentDetails.address}</div>
              
              <div><strong style={{ color: '#666' }}>Status:</strong> <br/>{selectedReq.studentDetails.occupation}</div>
              {selectedReq.studentDetails.occupation === 'Student' && (
                <>
                  <div><strong style={{ color: '#666' }}>College:</strong> <br/>{selectedReq.studentDetails.collegeName}</div>
                  <div><strong style={{ color: '#666' }}>Course:</strong> <br/>{selectedReq.studentDetails.course}</div>
                </>
              )}
            </div>

            <h4 style={{ borderBottom: '1px solid #e6d9ef', paddingBottom: '5px', marginTop: '20px', color: '#4a3b52' }}>Parent Details</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div><strong style={{ color: '#666' }}>Father:</strong> <br/>{selectedReq.studentDetails.fatherName}</div>
              <div><strong style={{ color: '#666' }}>Contact:</strong> <br/>{selectedReq.studentDetails.parentPhone}</div>
            </div>

            {selectedReq.status === 'PENDING' && (
              <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                <button onClick={() => updateStatus(selectedReq.id, 'CONFIRMED')} style={{ flex: 1, padding: '12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Approve Booking</button>
                <button onClick={() => updateStatus(selectedReq.id, 'REJECTED')} style={{ flex: 1, padding: '12px', backgroundColor: '#F44336', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Reject Booking</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;