const express = require('express');
const cors = require('cors');
const { parse } = require('csv-parse');
const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests only from this origin
}));


// Import routes
const awardProgramsRoutes = require('./routes/awardPrograms.js');

// Root route for the base URL
app.get('/', (req, res) => {
    res.send('Welcome to the Award Travel Helper API!');
});

// Use routes
app.use('/api/award-programs', awardProgramsRoutes);

// API route to search for an airport
app.get("/api/search-airport", async (req, res) => {
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
        // Parse the CSV data from the string
        parse(csvText, { columns: true, relax_column_count: true, skip_lines_with_error: true }, (err, records) => {
            if (err) {
                return res.status(500).json({ error: "CSV processing error", details: err.message });
            }

            // Filter out airports without a valid IATA code.
            const airportsWithIATACode = records.filter(record => record.iata_code && record.iata_code.trim() !== "");

            if (searchTerm) {
                const lowerSearchTerm = searchTerm.toLowerCase();
                const matchingAirports = airportsWithIATACode.filter(record =>
                record.iata_code.toLowerCase().includes(lowerSearchTerm) ||
                record.name.toLowerCase().includes(lowerSearchTerm)
                );
                return res.json(matchingAirports);
            } else if (iataCode) {
                // Fallback to exact match if needed.
                const foundAirport = airportsWithIATACode.find(record => record.iata_code.toUpperCase() === iataCode.toUpperCase());
                if (foundAirport) {
                return res.json(foundAirport);
                } else {
                return res.json([]);
                }
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

