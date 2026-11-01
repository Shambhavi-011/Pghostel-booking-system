import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingBookingId, setPayingBookingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [phoneFilter, setPhoneFilter] = useState(localStorage.getItem('userPhone') || '');

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const [bookingsRes, propsRes] = await Promise.all([
        axios.get('/api/bookings'),
        axios.get('/api/properties/all'),
      ]);

      const propsMap = new Map((propsRes.data || []).map((p) => [p.id, p]));
      const allBookings = (bookingsRes.data || []).map((b) => ({
        ...b,
        property: propsMap.get(b.propertyId),
      }));

      setBookings(allBookings);
    } catch (err) {
      console.error('Failed to load bookings:', err);
      setToast({ type: 'error', message: 'Failed to load bookings. Check that backend is running.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Handle ₹500 Token Payment for Confirmed Bookings
  const handlePayToken = async (booking) => {
    setPayingBookingId(booking.id);
    const vivaEmail = localStorage.getItem('userEmail') || '';

    try {
      await loadRazorpayScript();

      // 1. Create order
      const orderRes = await axios.post('/api/bookings/create-order');
      const { orderId, amount, currency, keyId } = orderRes.data;

      // 2. Demo simulation fallback if key is placeholder
      if (!keyId || keyId.includes('placeholder')) {
        const simulatedPaymentId = 'pay_demo_' + Date.now();
        await axios.put(`/api/bookings/${booking.id}/payment`, null, {
          params: { paymentId: simulatedPaymentId, paymentStatus: 'PAID' },
        });

        setToast({
          type: 'success',
          message: `₹500 Token Payment Successful (Demo ID: ${simulatedPaymentId})! Your stay is confirmed.`,
        });
        await fetchBookings();
        return;
      }

      // 3. Official Razorpay Checkout Modal
      const options = {
        key: keyId,
        amount: amount || 50000,
        currency: currency || 'INR',
        name: 'SpaceMatch',
        description: `Advance Token Booking for ${booking.property?.pgName || 'PG'}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            await axios.put(`/api/bookings/${booking.id}/payment`, null, {
              params: {
                paymentId: response.razorpay_payment_id,
                paymentStatus: 'PAID',
              },
            });
            setToast({
              type: 'success',
              message: `Payment Successful! ₹500 Token paid (Txn: ${response.razorpay_payment_id}).`,
            });
            await fetchBookings();
          } catch (err) {
            setToast({ type: 'error', message: 'Payment captured but failed to update status on server.' });
          } finally {
            setPayingBookingId(null);
          }
        },
        prefill: {
          name: booking.fullName || '',
          contact: booking.phone || '',
          email: vivaEmail,
        },
        theme: { color: '#80608f' },
        modal: {
          ondismiss: function () {
            setPayingBookingId(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        setToast({ type: 'error', message: 'Payment failed: ' + resp.error.description });
        setPayingBookingId(null);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', message: 'Could not launch payment gateway. Try again.' });
    } finally {
      setPayingBookingId(null);
    }
  };

  // Filter student bookings by phone or show all
  const filteredBookings = phoneFilter.trim()
    ? bookings.filter((b) => b.phone && b.phone.includes(phoneFilter.trim()))
    : bookings;

  return (
    <main style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '25px', borderBottom: '2px solid #e6d9ef', paddingBottom: '15px' }}>
        <div>
          <h1 style={{ color: '#4a3b52', margin: '0 0 5px 0' }}>📋 My Booking Requests</h1>
          <p style={{ color: '#786d84', margin: 0 }}>
            Once the PG owner accepts your request, your ₹500 token payment option will unlock here.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'bold' }}>Filter by phone:</label>
          <input
            type="text"
            placeholder="Enter your phone"
            value={phoneFilter}
            onChange={(e) => setPhoneFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d5c8de', outline: 'none' }}
          />
          {phoneFilter && (
            <button
              onClick={() => setPhoneFilter('')}
              style={{ padding: '8px 12px', background: '#f4eff7', border: '1px solid #d5c8de', borderRadius: '6px', cursor: 'pointer', color: '#666' }}
            >
              Show all
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#888' }}>Loading bookings...</p>
      ) : filteredBookings.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '12px', border: '1px solid #e6d9ef' }}>
          <p style={{ fontSize: '1.2rem', color: '#786d84', margin: '0 0 15px 0' }}>No booking requests found.</p>
          <p style={{ color: '#aaa', margin: 0 }}>Browse PGs and submit a booking request. It will appear here!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredBookings.map((b) => {
            const isApproved = b.status === 'CONFIRMED';
            const isPaid = b.paymentStatus === 'PAID';
            const isPending = b.status === 'PENDING';
            const isRejected = b.status === 'REJECTED';

            return (
              <article
                key={b.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 4px 15px rgba(128, 96, 143, 0.08)',
                  borderLeft: isPaid
                    ? '6px solid #2ecc71'
                    : isApproved
                    ? '6px solid #f39c12'
                    : isRejected
                    ? '6px solid #e74c3c'
                    : '6px solid #3498db',
                  border: '1px solid #f0e6f6',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '20px',
                }}
              >
                <div style={{ flex: '1 1 300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#4a3b52' }}>
                      🏠 {b.property?.pgName || `PG #${b.propertyId}`}
                    </h2>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        background: isApproved ? '#e8f8f5' : isRejected ? '#fdedec' : '#fef9e7',
                        color: isApproved ? '#27ae60' : isRejected ? '#c0392b' : '#f39c12',
                      }}
                    >
                      Owner: {b.status}
                    </span>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        background: isPaid ? '#e8f8f5' : '#fef5e7',
                        color: isPaid ? '#27ae60' : '#d35400',
                      }}
                    >
                      Payment: {b.paymentStatus || 'UNPAID'}
                    </span>
                  </div>

                  <p style={{ margin: '4px 0', color: '#666', fontSize: '0.95rem' }}>
                    📍 {[b.property?.locality, b.property?.city].filter(Boolean).join(', ') || 'Meerut'}
                  </p>
                  <p style={{ margin: '4px 0', color: '#666', fontSize: '0.95rem' }}>
                    👤 <strong>Applicant:</strong> {b.fullName} | 📞 <strong>Phone:</strong> {b.phone}
                  </p>
                  <p style={{ margin: '4px 0', color: '#666', fontSize: '0.95rem' }}>
                    📅 <strong>Move-in date:</strong> {b.moveInDate || 'Not specified'} | <strong>Rent:</strong> ₹{b.property?.price || 'N/A'}/month
                  </p>

                  {/* Status explanation messages */}
                  {isPending && (
                    <div style={{ marginTop: '12px', padding: '10px 14px', background: '#ebf5fb', borderRadius: '8px', color: '#2980b9', fontSize: '0.9rem' }}>
                      ⏳ <strong>Waiting for Owner:</strong> The PG owner has received your request. Once they accept, the <strong>₹500 Token Payment</strong> button will activate here.
                    </div>
                  )}

                  {isRejected && (
                    <div style={{ marginTop: '12px', padding: '10px 14px', background: '#fdedec', borderRadius: '8px', color: '#c0392b', fontSize: '0.9rem' }}>
                      ❌ <strong>Request Declined:</strong> The owner was unable to accommodate this booking request. You can browse other available PGs!
                    </div>
                  )}

                  {isApproved && !isPaid && (
                    <div style={{ marginTop: '12px', padding: '10px 14px', background: '#fef9e7', borderRadius: '8px', color: '#b7950b', fontSize: '0.9rem' }}>
                      🎉 <strong>Owner Accepted!</strong> Please pay the ₹500 advance token amount now to confirm and reserve your bed.
                    </div>
                  )}

                  {isPaid && (
                    <div style={{ marginTop: '12px', padding: '10px 14px', background: '#eafaf1', borderRadius: '8px', color: '#1e8449', fontSize: '0.9rem' }}>
                      ✅ <strong>Booking Confirmed & Secured!</strong> ₹500 token paid. Payment Reference: <code>{b.paymentId}</code>.
                    </div>
                  )}
                </div>

                {/* Action button */}
                <div>
                  {isApproved && !isPaid && (
                    <button
                      type="button"
                      disabled={payingBookingId === b.id}
                      onClick={() => handlePayToken(b)}
                      style={{
                        padding: '14px 28px',
                        backgroundColor: '#80608f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        boxShadow: '0 4px 10px rgba(128, 96, 143, 0.3)',
                        transition: '0.3s',
                      }}
                      onMouseOver={(e) => (e.target.style.backgroundColor = '#624670')}
                      onMouseOut={(e) => (e.target.style.backgroundColor = '#80608f')}
                    >
                      {payingBookingId === b.id ? 'Processing...' : '💳 Pay ₹500 Token Now'}
                    </button>
                  )}

                  {isPaid && (
                    <div style={{ textAlign: 'center', color: '#27ae60', fontWeight: 'bold' }}>
                      <span style={{ fontSize: '1.8rem' }}>🎉</span>
                      <div>Room Booked</div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default MyBookings;

