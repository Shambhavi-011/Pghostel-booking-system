import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const hasCoordinates = (property) => (
  Number.isFinite(Number(property.latitude))
  && Number.isFinite(Number(property.longitude))
  && property.latitude !== null
  && property.longitude !== null
  && property.latitude !== ''
  && property.longitude !== ''
);

const MapViewport = ({ location, properties }) => {
  const map = useMap();

  useEffect(() => {
    const points = properties
      .filter(hasCoordinates)
      .map((property) => [Number(property.latitude), Number(property.longitude)]);

    if (points.length > 1) {
      map.fitBounds(points, { padding: [35, 35], maxZoom: 15 });
    } else if (points.length === 1) {
      map.setView(points[0], 15);
    } else {
      map.setView([location.lat, location.lng], 13);
    }
  }, [location.lat, location.lng, map, properties]);

  return null;
};

const MapComponent = ({ location, properties = [] }) => {
  const mapKey = `${location.lat}-${location.lng}`;
  const hasPropertyMarkers = properties.some(hasCoordinates);

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e6d9ef' }}>
      <MapContainer key={mapKey} center={[location.lat, location.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapViewport location={location} properties={properties} />
        {properties.filter(hasCoordinates).map((property) => (
          <Marker key={property.id || property.excelId} position={[Number(property.latitude), Number(property.longitude)]}>
            <Popup>
              <strong>{property.pgName || 'PG / Hostel'}</strong>
              <br />
              {[property.locality, property.city].filter(Boolean).join(', ')}
              {property.price != null && <><br />₹{Number(property.price).toLocaleString('en-IN')} / month</>}
            </Popup>
          </Marker>
        ))}
        {!hasPropertyMarkers && (
          <>
            <Marker position={[location.lat, location.lng]}>
              <Popup>{location.name} · Search area</Popup>
            </Marker>
            <Circle
              center={[location.lat, location.lng]}
              radius={2000}
              pathOptions={{ color: '#80608f', fillColor: '#80608f', fillOpacity: 0.2 }}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
