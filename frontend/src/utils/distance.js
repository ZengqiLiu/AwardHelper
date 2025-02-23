export function distance(lat1, lon1, lat2, lon2) {
  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };
  // Haversine formula 
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const R_km = 6371; // Radius of the earth in km 
  const d_km = R_km * c; // Distance in km
  const d_mi = d_km * 0.621371; // Distance in miles
  return { distance_km: Math.round(d_km), distance_mi: Math.round(d_mi) };
}