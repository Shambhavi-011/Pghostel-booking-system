import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const OwnerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchRequests = useCallback(async (manual = false) => {
    if (manual) {
      setRefreshing(true);
      setRefreshMessage('');
    }
    try {
      const [bookingResponse, propertyResponse] = await Promise.all([
        axios.get('/api/bookings'),
        axios.get('/api/properties/all'),
      ]);
      if (!Array.isArray(bookingResponse.data) || !Array.isArray(propertyResponse.data)) {
        throw new Error('The booking or property API returned an invalid response.');
      }
      const propertiesById = new Map(propertyResponse.data.map((property) => [property.id, property]));
      setRequests(bookingResponse.data.map((request) => ({
        ...request,
        property: propertiesById.get(request.propertyId),
      })));
      setError('');
      if (manual) setRefreshMessage('Requests refreshed.');
    } catch (requestError) {
      console.error('Error fetching booking requests:', requestError);
      setError('Could not reach the booking API. Check that Spring Boot is running on port 8080 and the frontend proxy targets that port.');
    } finally {
      setLoading(false);
      if (manual) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
    const refreshTimer = window.setInterval(fetchRequests, 10000);
    return () => window.clearInterval(refreshTimer);
  }, [fetchRequests]);

  const updateStatus = async (bookingId, status) => {
    setUpdatingId(bookingId);
    try {
      await axios.put(`/api/bookings/${bookingId}/status`, null, { params: { status } });
      setToast(`Booking ${status.toLowerCase()} successfully.`);
      await fetchRequests();
      setSelectedRequest(null);
    } catch (requestError) {
      console.error('Error updating booking status:', requestError);
      const errorMessage = requestError.response?.data?.detail || 'Could not update this booking.';
      setToast(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    } finally {
      setUpdatingId(null);
      window.setTimeout(() => setToast(null), 3500);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading booking requests...</p>;

  return (
    <main style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif', position: 'relative' }}>
      {toast && (
        <p role="status" style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          padding: '14px 22px',
          borderRadius: '8px',
          background: '#4a3b52',
          color: 'white',
          boxShadow: '0 4px 12px #0003',
        }}>
          {toast}
        </p>
      )}

      <h2 style={{ color: '#4a3b52', borderBottom: '2px solid #e6d9ef', paddingBottom: '10px' }}>
        🏠 Owner Dashboard
      </h2>
      <button
        type="button"
        onClick={() => fetchRequests(true)}
        disabled={refreshing}
        aria-busy={refreshing}
        style={{ marginBottom: '20px', padding: '9px 14px', border: 0, borderRadius: '6px', background: '#e6dff0', color: '#4a154b', fontWeight: 700 }}
      >
        {refreshing ? 'Refreshing...' : 'Refresh requests'}
      </button>
      {refreshMessage && <p role="status" style={{ margin: '-10px 0 20px', color: '#287a36' }}>{refreshMessage}</p>}

      {error && <p role="alert" style={{ padding: '15px', color: '#a32121', background: '#fff', borderRadius: '8px' }}>{error}</p>}
      {!error && requests.length === 0 ? (
        <div style={{ padding: '30px', background: '#fff', borderRadius: '8px', border: '1px solid #e6d9ef', textAlign: 'center' }}>
          No booking requests yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {requests.map((request) => (
            <article key={request.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '20px',
              flexWrap: 'wrap',
              background: '#fff',
              padding: '20px',
              borderRadius: '8px',
              borderLeft: request.status === 'PENDING' ? '5px solid #ffb74d' : request.status === 'CONFIRMED' ? '5px solid #4caf50' : '5px solid #f44336',
              boxShadow: '0 2px 4px #0000000d',
            }}>
              <div>
                <h3 style={{ margin: '0 0 8px', color: '#4a3b52' }}>
                  🏠 {request.property?.pgName || `PG #${request.propertyId}`}
                </h3>
                <p style={{ margin: '0 0 5px', fontWeight: 700, color: '#333' }}>👤 {request.fullName || 'Name not provided'}</p>
                <p style={{ margin: '0 0 5px', color: '#666' }}>📞 {request.phone || 'Phone not provided'}</p>
                <p style={{ margin: '0 0 5px', color: '#666' }}>Move-in: {request.moveInDate || 'Not provided'}</p>
                <p style={{ margin: 0, fontWeight: 700, color: request.status === 'PENDING' ? '#ff9800' : request.status === 'CONFIRMED' ? '#4caf50' : '#f44336' }}>
                  Status: {request.status}
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedRequest(request)}
                  style={{ padding: '9px 14px', background: '#80608f', color: 'white', border: 0, borderRadius: '5px', fontWeight: 700 }}
                >
                  View details
                </button>
                {request.status === 'PENDING' && (
                  <>
                    <button
                      type="button"
                      disabled={updatingId === request.id}
                      onClick={() => updateStatus(request.id, 'CONFIRMED')}
                      style={{ padding: '9px 14px', background: '#4caf50', color: 'white', border: 0, borderRadius: '5px', fontWeight: 700 }}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === request.id}
                      onClick={() => updateStatus(request.id, 'REJECTED')}
                      style={{ padding: '9px 14px', background: '#f44336', color: 'white', border: 0, borderRadius: '5px', fontWeight: 700 }}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedRequest && (
        <div
          className="booking-details-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-details-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelectedRequest(null);
          }}
        >
          <section className="booking-details-panel">
            <button
              type="button"
              className="property-dialog-close"
              onClick={() => setSelectedRequest(null)}
              aria-label="Close booking details"
            >
              &times;
            </button>
            <div className="property-dialog-content">
              <p className="property-dialog-eyebrow">BOOKING REQUEST · {selectedRequest.status}</p>
              <h2 id="booking-details-title">{selectedRequest.property?.pgName || `PG #${selectedRequest.propertyId}`}</h2>
              <dl className="property-dialog-facts">
                <div><dt>Applicant</dt><dd>{selectedRequest.fullName || 'Not provided'}</dd></div>
                <div><dt>Phone</dt><dd>{selectedRequest.phone || 'Not provided'}</dd></div>
                <div><dt>Move-in date</dt><dd>{selectedRequest.moveInDate || 'Not provided'}</dd></div>
                <div><dt>Request date</dt><dd>{selectedRequest.bookingDate || 'Not provided'}</dd></div>
                <div><dt>Location</dt><dd>{[selectedRequest.property?.locality, selectedRequest.property?.city].filter(Boolean).join(', ') || 'Not listed'}</dd></div>
                <div><dt>Price</dt><dd>{selectedRequest.property?.price != null ? `₹${Number(selectedRequest.property.price).toLocaleString('en-IN')} / month` : 'Not listed'}</dd></div>
              </dl>
              {selectedRequest.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button type="button" disabled={updatingId === selectedRequest.id} onClick={() => updateStatus(selectedRequest.id, 'CONFIRMED')}>
                    Approve booking
                  </button>
                  <button type="button" disabled={updatingId === selectedRequest.id} onClick={() => updateStatus(selectedRequest.id, 'REJECTED')}>
                    Reject booking
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default OwnerDashboard;
