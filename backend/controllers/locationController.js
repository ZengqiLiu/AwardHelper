// controllers/locationController.js
const { parse } = require('csv-parse');

exports.searchLocation = async (req, res, codeToMatch, url) => {
    if (!codeToMatch) {
        return res.status(400).json({ error: `${codeToMatch} is required` });
    }

    try {
        const response = await fetch(url, { headers: { Accept: "application/vnd.github.v3.raw" } });
        if (!response.ok) {
            return res.status(response.status).json({ error: `Failed to fetch ${codeToMatch} data CSV` });
        }

        const csvText = await response.text();
        // Parse the CSV data
        parse(csvText, { columns: true, relax_column_count: true, skip_lines_with_error: true }, (err, records) => {
            if (err) {
                return res.status(500).json({ error: "CSV processing error", details: err.message });
            }

            const foundCode = records.find((record) => {
                return record.code === codeToMatch;
            });

            if (foundCode) {
                return res.json(foundCode);
            }
            return res.status(404).json({ error: `${codeToMatch} not found` });
        });
    } catch (error) {
        console.error(`Error fetching or processing ${codeToMatch} data:`, error);
        return res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

exports.searchCountry = async (req, res) => {
    const countryCode = req.query.code;
    const countryUrl = "https://raw.githubusercontent.com/davidmegginson/ourairports-data/refs/heads/main/countries.csv";
    await exports.searchLocation(req, res, countryCode, countryUrl);
};

exports.searchRegion = async (req, res) => {
    const regionCode = 'region';
    const regionUrl = 'https://example.com/regionData.csv';
    await exports.searchLocation(req, res, regionCode, regionUrl);
}