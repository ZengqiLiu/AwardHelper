// controllers/distanceController.js

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
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

function getDistance(req, res) {
    const lat1 = parseFloat(req.query.lat1);
    const lon1 = parseFloat(req.query.lon1);
    const lat2 = parseFloat(req.query.lat2);
    const lon2 = parseFloat(req.query.lon2);
  
    if ([lat1, lon1, lat2, lon2].some(val => isNaN(val))) {
      return res.status(400).json({ error: 'Invalid query parameters.' });
    }
  
    const result = calculateDistance(lat1, lon1, lat2, lon2);
    res.json(result);
}
  
module.exports = {
    getDistance,
    calculateDistance
};