const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// API to fetch award programs from the JSON file
router.get('/', (req, res) => {
    const filePath = path.join(__dirname, '../data/awardPrograms.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            res.status(500).json({ message: 'Error reading data' });
        } else {
            res.json(JSON.parse(data)); // Send the parsed JSON as the response
        }
    });
});

// API to fetch details for a specific program
router.get('/:programName', (req, res) => {
    const programName = req.params.programName.toUpperCase(); // Program name from the request
    const filePath = path.join(__dirname, `../data/awardPrograms/${programName}.json`);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`File not found: ${filePath}`);
            return res.status(404).json({ 
                message: `Program ${programName} not found`, 
                filePath 
            });
        }
        res.json(JSON.parse(data));
    });
    
});


module.exports = router;
