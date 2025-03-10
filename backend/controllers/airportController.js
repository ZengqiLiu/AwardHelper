// controllers/airportController.js
const { parse } = require('csv-parse');

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
