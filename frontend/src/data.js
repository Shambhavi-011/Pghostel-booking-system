export const COLLEGES = [
  { id: 'miet', short: 'MIET', name: 'Meerut Institute of Engineering & Technology', area: 'Baghpat Road Bypass', initials: 'MI', tone: 'violet', position: [28.9731, 77.6402], url: 'https://www.miet.ac.in/' },
  { id: 'ccs', short: 'CCS University', name: 'Chaudhary Charan Singh University', area: 'Ramgarhi, Meerut', initials: 'CC', tone: 'peach', position: [28.970, 77.741], url: 'https://www.ccsuniversity.ac.in/contact' },
  { id: 'iimt', short: 'IIMT University', name: 'IIMT University', area: 'Ganga Nagar · Mawana Road', initials: 'II', tone: 'mint', position: [29.031, 77.752], url: 'https://iimtu.edu.in/contact' },
  { id: 'subharti', short: 'Subharti University', name: 'Swami Vivekanand Subharti University', area: 'Subhartipuram · NH-58', initials: 'SU', tone: 'rose', position: [28.965, 77.646], url: 'https://subharti.org/' },
  { id: 'vidya', short: 'Vidya University', name: 'Vidya University · formerly Vidya Knowledge Park', area: 'Baghpat Bypass, Meerut', initials: 'VU', tone: 'blue', position: [28.959, 77.636], url: 'https://vidya.edu.in/admissions-contact-us' },
];

// Existing pg_catalog.csv records. All distance fields refer to MIET.
// Photography is illustrative; availability and property locations are not verified.
export const STAYS = [
  { id: 101, name: 'Sunrise Girls Hostel', rent: 8000, distance: 2, sharing: 2, ac: true, image: 'bedroom.jpg', category: 'girls', tagline: 'A little room for your big plans.' },
  { id: 102, name: 'MIET Boys PG', rent: 6000, distance: 1, sharing: 3, ac: false, image: 'studio.jpg', category: 'boys', tagline: 'More company. Less commute.' },
  { id: 103, name: 'Luxury Stay PG', rent: 12000, distance: 3, sharing: 1, ac: true, image: 'living-room.jpg', category: 'unspecified', tagline: 'Your own corner of the city.' },
  { id: 104, name: 'Budget Rooms', rent: 4000, distance: 5, sharing: 3, ac: false, image: 'bedroom.jpg', category: 'unspecified', tagline: 'Keep a little more for the weekend.' },
  { id: 105, name: 'Elite Scholars Hostel', rent: 9000, distance: 2, sharing: 2, ac: true, image: 'living-room.jpg', category: 'unspecified', tagline: 'Settle in. Make it yours.' },
  { id: 106, name: 'Roorkee Road PG', rent: 5500, distance: 4, sharing: 2, ac: false, image: 'studio.jpg', category: 'unspecified', tagline: 'A fresh start, within your budget.' },
  { id: 107, name: 'Campus View Hostel', rent: 7500, distance: 1, sharing: 2, ac: true, image: 'bedroom.jpg', category: 'unspecified', tagline: 'A home base for campus life.' },
].map((stay) => ({ ...stay, college: 'miet' }));

export const money = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
