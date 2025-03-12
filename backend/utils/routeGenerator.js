// utils/routeGenerator.js
const path = require('path');
const fs = require('fs');

/**
 * Returns an array of route objects for the specified award program and zone pair.
 *
 * @param {string} awardProgramCode - The award program code (e.g. "CZ").
 * @param {string} zoneType - The type of zone ("self", "partner", "special", etc.).
 * @param {string} departureZone - The matched departure zone (e.g. "China").
 * @param {string} landingZone - The matched landing zone (e.g. "HK/MO/TW/INTL").
 * @returns {Array} - An array of route objects matching the zone pair, or an empty array if none found.
 */
function getRoutesForZonePair(awardProgramCode, zoneType, departureZone, landingZone) {
  try {
    const programFilePath = path.join(__dirname, '..', 'data', 'awardPrograms', `${awardProgramCode}.json`);
    if (!fs.existsSync(programFilePath)) {
      console.error(`Program file not found for code: ${awardProgramCode}`);
      return [];
    }
    const programData = JSON.parse(fs.readFileSync(programFilePath, 'utf8'));
    
    // Select the routes array based on the zoneType.
    let routes;
    if (zoneType === 'self') {
      routes = programData.selfRoutes;
    } else if (zoneType === 'partner') {
      routes = programData.partnerRoutes;
    } else if (zoneType === 'special') {
      routes = programData.specialRoutes;
    } else {
      console.error(`Unknown zoneType: ${zoneType}`);
      return [];
    }
    
    if (!Array.isArray(routes)) {
      console.error(`Routes is not an array for zoneType: ${zoneType}`);
      return [];
    }
    
    // Filter the routes to only include those that match the departure and landing zones.
    const filteredRoutes = routes.filter(route => {
      return route.departureZone === departureZone && route.landingZone === landingZone;
    });
    
    return filteredRoutes;
  } catch (error) {
    console.error('Error in getRoutesForZonePair:', error);
    return [];
  }
}

module.exports = { getRoutesForZonePair };
