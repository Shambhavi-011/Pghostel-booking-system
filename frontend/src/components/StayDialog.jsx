import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { getPropertyImage, money } from '../data';

const showValue = (value) => {
  if (value === null || value === undefined || value === '') return 'Not provided';
  return value;
};

const safeWebLink = (value) => {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
};

export default function StayDialog({ property, close }) {
  const dialog = useRef(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [booking, setBooking] = useState({ fullName: '', phone: '', moveInDate: '' });
  const [submitting, setSubmitting] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingError, setBookingError] = useState('');
  const imageUrl = getPropertyImage(property);
  const mapUrl = safeWebLink(property.googleMapsSearch);
  const today = new Date();
  const minMoveInDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const facts = [
    ['Area', [property.locality, property.city].filter(Boolean).join(', ')],
    ['For', property.gender],
    ['Room / sharing', property.roomType || property.bedSharing],
    ['Wi-Fi', property.wifi],
    ['Meals', property.mealsIncluded || property.meal || property.foodType],
    ['Air conditioning', property.ac],
    ['Laundry', property.laundry],
    ['Water', property.water],
    ['Electricity', property.electricity],
    ['Security', property.security || property.safetySecurityRating],
    ['Parking', property.parking],
    ['Power backup', property.powerBackup],
    ['Rating', property.overallRating ? `${property.overallRating} / 5` : null],
    ['Reviews', property.reviewCount],
  ].filter(([, value]) => value !== null && value !== undefined && value !== '');

  const submitBooking = async (event) => {
    event.preventDefault();
    const phoneDigits = booking.phone.replace(/\D/g, '');
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      setBookingError('Enter a valid phone number with 7 to 15 digits.');
      setBookingMessage('');
      return;
    }

    setSubmitting(true);
    setBookingError('');
    setBookingMessage('');
    try {
      await axios.post('/api/bookings', {
        propertyId: property.id,
        fullName: booking.fullName.trim(),
        phone: booking.phone.trim(),
        moveInDate: booking.moveInDate,
      });
      setBookingMessage('Booking request sent. The owner will review it shortly.');
    } catch (requestError) {
      const responseData = requestError.response?.data;
      const serverMessage = responseData?.detail || responseData?.message;
      if (typeof serverMessage === 'string') {
        setBookingError(serverMessage);
      } else if (requestError.response?.status === 400) {
        setBookingError('The server rejected this request. Check the phone number and move-in date, then try again.');
      } else if (requestError.response) {
        setBookingError(`Could not submit your booking request (HTTP ${requestError.response.status}). Please try again.`);
      } else {
        setBookingError('Cannot reach the booking service. Check that the backend is running, then try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement;
    if (!element.open) element.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      if (element.open) element.close();
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      className="property-dialog"
      aria-labelledby="property-dialog-title"
      onCancel={close}
      onClick={(event) => {
        if (event.target === dialog.current) close();
      }}
    >
      {imageUrl && !imageFailed && (
        <img
          className="property-dialog-photo"
          src={imageUrl}
          alt={`${property.pgName} room`}
          onError={() => setImageFailed(true)}
        />
      )}
      <button className="property-dialog-close" type="button" onClick={close} aria-label="Close property details">
        &times;
      </button>
      <div className="property-dialog-content">
        <p className="property-dialog-eyebrow">
          {property.excelId ? `DATASET LISTING · ${property.excelId}` : 'PG / HOSTEL DETAILS'}
        </p>
        <h2 id="property-dialog-title">{property.pgName || 'PG / Hostel'}</h2>
        <p className="property-dialog-location">
          {[property.locality, property.city].filter(Boolean).join(', ') || 'Location not listed'}
        </p>
        <p className="property-dialog-rent">
          {property.price != null ? `${money(property.price)} / month` : 'Price not listed'}
        </p>
        <dl className="property-dialog-facts">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{showValue(value)}</dd>
            </div>
          ))}
        </dl>
        {property.reviewsComments && <p className="property-review">{property.reviewsComments}</p>}
        <p className="property-data-notice">
          Photos shown from the local catalog are illustrative, not verified photos of this property.
          Rent, amenities, availability and contact details should be confirmed with the owner.
        </p>
        {mapUrl && (
          <a className="property-map-link" href={mapUrl} target="_blank" rel="noreferrer">
            Open location search
          </a>
        )}
        <form className="property-booking-form" onSubmit={submitBooking}>
          <h3>Request a booking</h3>
          <label>
            Full name
            <input
              autoComplete="name"
              maxLength="120"
              required
              value={booking.fullName}
              onChange={(event) => setBooking((current) => ({ ...current, fullName: event.target.value }))}
            />
          </label>
          <label>
            Phone number
            <input
              autoComplete="tel"
              type="tel"
              inputMode="tel"
              maxLength="20"
              required
              value={booking.phone}
              onChange={(event) => setBooking((current) => ({ ...current, phone: event.target.value }))}
            />
          </label>
          <label>
            Move-in date
            <input
              type="date"
              min={minMoveInDate}
              required
              value={booking.moveInDate}
              onChange={(event) => setBooking((current) => ({ ...current, moveInDate: event.target.value }))}
            />
          </label>
          <button type="submit" disabled={submitting || Boolean(bookingMessage)}>
            {submitting ? 'Sending request...' : 'Send booking request'}
          </button>
          {bookingMessage && <p className="booking-success" role="status">{bookingMessage}</p>}
          {bookingError && <p className="booking-error" role="alert">{bookingError}</p>}
        </form>
      </div>
    </dialog>
  );
}
