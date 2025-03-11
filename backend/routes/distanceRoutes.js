// routes/distanceRoutes.js

const express = require('express');
const router = express.Router();
const getDistance = require('../controllers/distanceController');

router.get('/distance', getDistance.getDistance);

module.exports = router;