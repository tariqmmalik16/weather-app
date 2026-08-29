const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));

// Show the index.html page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API Route to get weather (Uses Open-Meteo - completely free, no key needed)
app.get('/api/weather', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }

    try {
        // 1. First, we search for the city's coordinates (Latitude and Longitude)
        const geoResponse = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
        
        if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
            return res.status(404).json({ error: 'City not found. Please try again.' });
        }

        const { latitude, longitude, name } = geoResponse.data.results[0];

        // 2. Then, we get the weather for those exact coordinates
        const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);

        // 3. Send the weather back to the frontend
        res.json({
            name: name,
            temp: weatherResponse.data.current_weather.temperature,
            description: weatherResponse.data.current_weather.weathercode
        });

    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Vercel needs this export
module.exports = app;

// Local testing
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
