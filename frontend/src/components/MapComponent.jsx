import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapComponent = ({ location }) => {
  // key tag change hone se React poore map ko re-render karta hai nayi location par
  const mapKey = `${location.lat}-${location.lng}`;

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e6d9ef' }}>
      <MapContainer key={mapKey} center={[location.lat, location.lng]} zoom={14} style={{ height: '100%', width: '100%' }}>
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
        />
        
        {/* User ka searched Area */}
        <Marker position={[location.lat, location.lng]}>
          <Popup>
            <b>{location.name}</b> <br />
            Search Area Center
          </Popup>
        </Marker>

        {/* 2 km ka radius circle dikhane ke liye (Optional Viva flex) */}
        <Circle 
          center={[location.lat, location.lng]} 
          radius={2000} 
          pathOptions={{ color: '#80608f', fillColor: '#80608f', fillOpacity: 0.2 }} 
        />
        
      </MapContainer>
    </div>
  );
};

export default MapComponent;