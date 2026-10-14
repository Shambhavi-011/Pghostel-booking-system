import React, { useState } from 'react';
import { getPropertyImage, money } from '../data';
import StayDialog from './StayDialog';
import './PropertyList.css';

const hasAmenity = (value) => {
  if (value === true || value === 1) return true;
  if (value === false || value === 0 || value == null) return false;
  return ['yes', 'true', 'available', 'included'].includes(String(value).trim().toLowerCase());
};

const PropertyPhoto = ({ property, className = '' }) => {
  const [failed, setFailed] = useState(false);
  const imageUrl = getPropertyImage(property);

  if (!imageUrl || failed) return null;

  return (
    <div className={className === 'property-card-photo' ? 'property-photo-wrap' : 'property-dialog-photo-wrap'}>
      <img
        className={className}
        src={imageUrl}
        alt={`${property.pgName}${imageUrl.startsWith('/images/') ? ' representative room photo' : ' room'}`}
        loading="lazy"
        onError={() => setFailed(true)}
      />
      {imageUrl.startsWith('/images/') && <span className="property-photo-caption">Sample photo</span>}
    </div>
  );
};

const PropertyList = ({ properties = [] }) => {
  const [selectedProperty, setSelectedProperty] = useState(null);

  return (
    <section className="property-section" aria-labelledby="property-list-title">
      <h2 id="property-list-title">AI Recommended PGs &amp; Hostels</h2>
      {properties.length === 0 ? (
        <p className="property-empty">Set your preferences above and find your AI-matched stays.</p>
      ) : (
        <div className="property-grid">
          {properties.map((property) => (
            <article className="property-card" key={property.id || property.excelId || property.pgName}>
              <PropertyPhoto property={property} className="property-card-photo" />
              <div className="property-card-content">
                <h3>{property.pgName || 'PG / Hostel'}</h3>
                <p className="property-location">
                  {[property.locality, property.city].filter(Boolean).join(', ') || 'Location not listed'}
                </p>
                <p className="property-rent">
                  {property.price != null ? `${money(property.price)} / month` : 'Price not listed'}
                </p>
                {property.matchPercentage && (
                  <p className="property-match-score">AI match: {property.matchPercentage}</p>
                )}
                <div className="property-amenities" aria-label="Available amenities">
                  {[
                    ['ac', 'AC'],
                    ['wifi', 'Wi-Fi'],
                    ['laundry', 'Laundry'],
                    ['meal', 'Food'],
                  ].filter(([key]) => hasAmenity(
                    key === 'meal' ? property.mealsIncluded || property.meal || property.foodType : property[key]
                  )).map(([, label]) => <span className="property-amenity" key={label}>{label}</span>)}
                </div>
                <button
                  className="property-details-button"
                  type="button"
                  onClick={() => setSelectedProperty(property)}
                  aria-label={`View details for ${property.pgName || 'this property'}`}
                >
                  View details
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      {selectedProperty && (
        <StayDialog property={selectedProperty} close={() => setSelectedProperty(null)} />
      )}
    </section>
  );
};

export default PropertyList;
