// routes/airportRoutes.js
const express = require('express');
const router = express.Router();
const airportController = require('../controllers/airportController');

router.get('/search-airport', airportController.searchAirport);

module.exports = router;
