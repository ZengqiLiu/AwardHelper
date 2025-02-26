// controllers/locationController.js
const { parse } = require('csv-parse');

exports.searchLocation = async (req, res, code, url) => {
    const codeToMatch = req.query.code;
    if (!codeToMatch) {
        return res.status(400).json({ error: `${code} is required` });
    }

    try {
        const response = await fetch(url, { headers: { Accept: "application/vnd.github.v3.raw" } });
        if (!response.ok) {
            return res.status(response.status).json({ error: `Failed to fetch ${code} data CSV` });
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
            return res.status(404).json({ error: `${code} not found` });
        });
    } catch (error) {
        console.error(`Error fetching or processing ${code} data:`, error);
        return res.status(500).json({ error: "Internal server error", details: error.message });
    }
}