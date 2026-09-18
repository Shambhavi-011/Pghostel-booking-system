import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { useReducedMotion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import { COLLEGES } from '../data';

function Recenter({ college }) {
  const map = useMap();
  const reduced = useReducedMotion();
  useEffect(() => { map.setView(college.position, 13, { animate: !reduced }); }, [college, map, reduced]);
  return null;
}
export default function CampusMap({ college, onSelect }) {
  return <MapContainer center={college.position} zoom={13} scrollWheelZoom={false} className="campus-map" aria-label="Meerut campus area map">
    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <Recenter college={college} />
    {COLLEGES.map((item) => <CircleMarker key={item.id} center={item.position} radius={college.id === item.id ? 13 : 8} pathOptions={{ color: '#fff', weight: 3, fillColor: college.id === item.id ? '#7950ed' : '#a994d8', fillOpacity: 1 }} eventHandlers={{ click: () => onSelect(item.id) }}>
      <Popup><strong>{item.short}</strong><br />{item.area}<br /><small>Approximate area marker, not an entrance or property pin.</small></Popup>
    </CircleMarker>)}
  </MapContainer>;
}
