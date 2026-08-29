const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the static HTML file (like index.html) from the same folder
app.use(express.static(__dirname));

// API Route to get weather (for testing)
app.get('/api/weather', async (req, res) => {
    try {
        const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=33.68&longitude=73.04&current_weather=true`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather' });
    }
});

// Vercel needs this export to run the app
module.exports = app;

// Only start the server if running locally
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
