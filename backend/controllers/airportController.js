// controllers/airportController.js
const { parse } = require('csv-parse');
const { getZoneForAirport } = require('../utils/zoneMatcher');
const { getRoutesForZonePair } = require('../utils/routeGenerator');
const { getRequiredPointsFromRoutes } = require('../utils/requiredPoints');
const { calculateDistance } = require('../utils/distance');

/**
 * New consolidated endpoint that returns zone information for all airports in the route,
 * and optionally computes route details (like required points for each segment).
 *
 * Expected request body:
 * {
 *   airportInfo: { ... } or [ ... ], // full list of airports in the route
 *   awardProgramCode: "CZ",
 *   zoneType: "self" | "partner" | "special",
 *   // Optionally, cumulativeDistance or segment distances if needed
 * }
 *
 * This endpoint returns:
 * {
 *   zones: [ "Zone1", "Zone2", ... ],
 *   segments: [
 *      {
 *         departureZone: "Zone1",
 *         arrivalZone: "Zone2",
 *         cost: { economy: "...", premiumEconomy: "...", business: "...", first: "..." }
 *      },
 *      ...
 *   ]
 * }
 *
 * For now, we'll return the zones for each airport. You can extend this to include segment details.
 */

exports.searchAirport = async (req, res) => {
  const searchTerm = req.query.search;
  const iataCode = req.query.iata_code;
  if (!searchTerm && !iataCode) {
      return res.status(400).json({ error: "IATA code or search term is required" });
  }

  const url = "https://raw.githubusercontent.com/davidmegginson/ourairports-data/main/airports.csv";

  try {
      const response = await fetch(url, { headers: { Accept: "application/vnd.github.v3.raw" } });
      if (!response.ok) {
          return res.status(response.status).json({ error: "Failed to fetch airport data CSV" });
      }

      const csvText = await response.text();
      // Parse the CSV data
      parse(csvText, { columns: true, relax_column_count: true, skip_lines_with_error: true }, (err, records) => {
          if (err) {
              return res.status(500).json({ error: "CSV processing error", details: err.message });
          }

          // Filter out airports without a valid IATA code.
          const airportsWithIATACode = records.filter(record => record.iata_code && record.iata_code.trim() !== "");
  
          // Check if searchTerm matches the pattern "Name (XXX)"
          const pattern = /^(.*)\s+\(([A-Z]{3})\)$/;
  
          if (searchTerm) {
            const match = searchTerm.match(pattern);
  
            if (match) {
                const namePart = match[1].trim();
                const codePart = match[2].trim();
                const exactMatch = airportsWithIATACode.find((record) => {
                    return (
                        record.iata_code.toUpperCase() === codePart &&
                        record.name.toLowerCase() === namePart.toLowerCase()
                    );
                });
    
                if (exactMatch) {
                    return res.json(exactMatch);
                }
            }
              const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
              const normalizedSearchTerm = normalize(searchTerm);
              let matchingAirports = [];
              
              if (searchTerm.length < 4) {
                const codeMatches = airportsWithIATACode.filter(record =>
                  normalize(record.iata_code).includes(normalizedSearchTerm)
                );
                const nameMatches = airportsWithIATACode.filter(record =>
                  normalize(record.name).includes(normalizedSearchTerm) &&
                  !codeMatches.includes(record)
                );
                matchingAirports = [...codeMatches, ...nameMatches];
              } else {
                matchingAirports = airportsWithIATACode.filter(record =>
                  normalize(record.iata_code).includes(normalizedSearchTerm) ||
                  normalize(record.name).includes(normalizedSearchTerm)
                );
              }
              
              return res.json(matchingAirports);
          } else if (iataCode) {
              const foundAirport = airportsWithIATACode.find(record => record.iata_code.toUpperCase() === iataCode.toUpperCase());
              return res.json(foundAirport ? foundAirport : []);
          }
      });
  } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
  }
};

exports.getAirportZone = async (req, res) => {
  console.log("Received body:", req.body); 
  const { region, country, continent, awardProgramCode, zoneType } = req.body;
  if (!region || !country || !continent || !awardProgramCode || !zoneType) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const airportInfo = { region, country, continent };
  const zone = getZoneForAirport(airportInfo, awardProgramCode, zoneType);
  if (!zone) {
    return res.status(404).json({ error: "No matching zone found" });
  }

  return res.json(zone);

}

exports.getRouteDetails = async (req, res) => {
  console.log("Received route details request body:", req.body); 
  const { airportInfo, awardProgramCode, zoneType} = req.body;
  if (!airportInfo || !awardProgramCode || !zoneType) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Convert airportInfo to an array if it's not already.
  const airportsArray = Array.isArray(airportInfo) ? airportInfo : Object.values(airportInfo);
  if (airportsArray.length < 2) {
    return res.status(400).json({ error: "At least two airports are required" });
  }

  // Compute zone for each airport.
  const zonesForAirports = airportsArray.map(airport => {
    return getZoneForAirport(
      { 
        region: airport.iso_region, 
        country: airport.iso_country, 
        continent: airport.continent 
      },
      awardProgramCode,
      zoneType
    );
  });

  // For each consecutive pair, compute segment details.
  const segments = [];
  for (let i = 0; i < airportsArray.length - 1; i++) {
    const departureAirport = airportsArray[i];
    const arrivalAirport = airportsArray[i + 1];
     
    // Calculate distance using Haversine formula.
    const distanceData = calculateDistance(
      parseFloat(departureAirport.latitude_deg),
      parseFloat(departureAirport.longitude_deg),
      parseFloat(arrivalAirport.latitude_deg),
      parseFloat(arrivalAirport.longitude_deg)
    );
    // We assume that your route configurations use kilometers.
    const segmentDistance = distanceData.distance_km;
     
    const departureZone = zonesForAirports[i];
    const arrivalZone = zonesForAirports[i + 1];

    // Retrieve the route configuration for the zone pair.
    const routes = getRoutesForZonePair(awardProgramCode, zoneType, departureZone, arrivalZone);
    
    // Determine the cost based on the segment distance.
    const cost = getRequiredPointsFromRoutes(routes, segmentDistance);
    
    segments.push({
      departureZone,
      arrivalZone,
      segmentDistance,
      cost
    });
  }

  return res.json({ zones: zonesForAirports, segments });
};
