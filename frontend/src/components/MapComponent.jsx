import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Map ki styling ke liye zaroori
import L from 'leaflet';

// React-Leaflet me default marker gayab hone ka fix
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({ lat, lng, pgName, rent }) => {
  // Default Meerut MIET ki location agar data na mile
  const position = [lat || 28.9731, lng || 77.6402];

  return (
    <div style={{ border: "2px solid #ccc", borderRadius: "10px", overflow: "hidden" }}>
      <MapContainer center={position} zoom={15} style={{ height: "300px", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <b>{pgName || "PG Location"}</b> <br /> 
            Rent: ₹{rent || "N/A"}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;