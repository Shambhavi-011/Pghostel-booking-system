import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// React-Leaflet ke icons theek karne ka code
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapComponent = ({ city }) => {
  // Alag-alag cities ke center coordinates
  const cityCoordinates = {
    'Meerut': { lat: 28.9731, lng: 77.6402 },
    'Noida': { lat: 28.5355, lng: 77.3910 },
    'Ghaziabad': { lat: 28.6692, lng: 77.4538 }
  };

  const center = cityCoordinates[city] || cityCoordinates['Meerut'];

  // Viva ke liye 1-2 dummy pins har city mein
  const dummyPins = {
    'Meerut': [{ id: 1, name: "Green Valley PG", lat: 28.9740, lng: 77.6410 }],
    'Noida': [{ id: 2, name: "Noida Boys Hostel", lat: 28.5360, lng: 77.3920 }],
    'Ghaziabad': [{ id: 3, name: "Ghaziabad Elite Stay", lat: 28.6700, lng: 77.4540 }]
  };

  const currentPins = dummyPins[city] || dummyPins['Meerut'];

  return (
    // key={city} lagane se jaise hi city change hogi, map naye jagah par reset ho jayega
    <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e6d9ef' }}>
      <MapContainer key={city} center={[center.lat, center.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          attribution='&copy; OpenStreetMap contributors' 
        />
        
        {/* Us city ke PGs (pins) map par dikhana */}
        {currentPins.map(pin => (
          <Marker key={pin.id} position={[pin.lat, pin.lng]}>
            <Popup>
              <b>{pin.name}</b> <br />
              Location: {city}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;