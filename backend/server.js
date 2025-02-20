const express = require('express');
const cors = require('cors');
const { parse } = require('csv-parse');
const { Readable } = require("stream");
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
app.get("/search-airport", async (req, res) => {
    const iataCode = req.query.iata_code;
    if (!iataCode) {
        return res.status(400).json({ error: "IATA code is required" });
    }

    const url = "https://raw.githubusercontent.com/davidmegginson/ourairports-data/main/airports.csv";

    try {
        const response = await fetch(url, { headers: { Accept: "application/vnd.github.v3.raw" } });
        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch airport data CSV" });
        }

        const nodeStream = Readable.from(response.body);
        let foundAirport = null;

        nodeStream
            .pipe(parse({ columns: true, relax_column_count: true }))
            .on("data", (row) => {
                if (row.iata_code === iataCode) {
                    foundAirport = row;
                    nodeStream.destroy(); // Stop reading the stream
                }
            })
            .on("end", () => {
                if (foundAirport) {
                    res.json(foundAirport);
                } else {
                    res.status(404).json({ error: "IATA code not found" });
                }
            })
            .on("error", (err) => res.status(500).json({ error: "CSV processing error", details: err.message }));
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


