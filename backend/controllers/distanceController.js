// controllers/distanceController.js

const { calculateDistance } = require('../utils/distance');

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

module.exports = { getDistance };
