// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(express.json()); 

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests only from this origin
}));

// Root route for the base URL
app.get('/', (req, res) => {
    res.send('Welcome to the Award Travel Helper API!');
});

// Import and use routes
const awardProgramsRoutes = require('./routes/awardPrograms.js');
const airportRoutes = require('./routes/airportRoutes.js');
const locationRoutes = require('./routes/locationRoutes.js');
const distanceRoutes = require('./routes/distanceRoutes.js');

app.use('/api/award-programs', awardProgramsRoutes);
app.use('/api', airportRoutes);
app.use('/api', locationRoutes);
app.use('/api', distanceRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
