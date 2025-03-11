// utils/zoneMatcher.js

const path = require('path');
const fs = require('fs');

/**
 * Compares a criteria value with an input value.
 * @param {string|Array} criteria - The criteria value (could be a string or an array) 
 *                                  or "*" for wildcard.
 * @param {string} inputValue - The value to match against.
 * @returns {Object} - { match: boolean, specificity: number }
 *                     Wildcard matches return a score of 0, while exact matches add 1.
 */
function matchField(criteria, inputValue) {
    if (typeof criteria === 'string') {
      if (criteria === "*") {
        return { match: true, specificity: 0 };
      } else {
        return { match: criteria === inputValue, specificity: criteria === inputValue ? 1 : 0 };
      }
    } else if (Array.isArray(criteria)) {
      // If the array includes "*", treat it as a wildcard.
      if (criteria.includes("*")) {
        return { match: true, specificity: 0 };
      } else {
        return { match: criteria.includes(inputValue), specificity: criteria.includes(inputValue) ? 1 : 0 };
      }
    } else {
      // If criteria is not provided, do not match.
      return { match: false, specificity: 0 };
    }
}


/**
 * Returns the best matching zone for a given airport locationa and program
 * @param {Object} airportInfo - An object containing the airport's latitude, longitude, region, country, continent
 * @param {string} awardProgramCode - The award program code to load the information file
 * @returns {string|null} The best matching zone or null if no match is found
 */
function getZoneForAirport(airportInfo, awardProgramCode, zoneType) {
    try {
        // Get the program file path
        const programFilePath = path.join(__dirname, `../data/awardPrograms/${awardProgramCode}.json`);
        if (!fs.existsSync(programFilePath)) {
            console.error(`Program file not found for code: ${awardProgramCode}`);
            return null;
        }
        // Read and parse the program data
        const programData = JSON.parse(fs.readFileSync(programFilePath, 'utf8'));
        const zones = (zoneType === 'self') ? programData.selfZones : (zoneType === 'partner')? programData.partnerZones : (zoneType === 'special')? programData.specialZones : null;

        let bestMatch = null;
        let bestMatchScore = -1;

        for (const [zoneName, criteria] of Object.entries(zones)) {
            let totalScore = 0;
            //Region match
            const regionResult = matchField(criteria.region, airportInfo.region);
            if (!regionResult.match) continue;
            totalScore += regionResult.specificity;

            //Country match
            const countryResult = matchField(criteria.country, airportLocation.country);
            if (!countryResult.match) continue;
            totalScore += countryResult.specificity;

            //Continent match
            const continentResult = matchField(criteria.continent, airportLocation.continent);
            if (!continentResult.match) continue;
            totalScore += continentResult.specificity;    

            // Update best match if this zone is more specific.
            if (totalScore > bestScore) {
                bestScore = totalScore;
                bestMatch = zoneName;
            }
        }

        return bestMatch;
    } catch (error) {
        console.error('Error in getZoneForAirport:', error);
        return null;
    }
}

module.exports = { getZoneForAirport };