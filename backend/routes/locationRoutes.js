// routes/locationRoutes.js
const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

router.get('/country', locationController.searchCountry);
router.get('/region', locationController.searchRegion);

module.exports = router;
