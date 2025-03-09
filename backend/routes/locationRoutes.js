// routes/locationRoutes.js
const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const continents = require('../data/continents.json');

router.get('/country', locationController.searchCountry);
router.get('/region', locationController.searchRegion);

router.get('/continents', (req, res) => {
    res.json(continents);
});

module.exports = router;
