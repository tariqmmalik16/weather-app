const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

// Show the index.html page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API Route using Open-Meteo (Free, works instantly, NO KEY NEEDED)
app.get('/api/weather', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }

    try {
        // Step 1: Find the city's coordinates
        const geoResponse = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
        
        if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
            return res.status(404).json({ error: 'City not found. Please try again.' });
        }

        const { latitude, longitude, name } = geoResponse.data.results[0];

        // Step 2: Get weather for those coordinates
        const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);

        res.json({
            name: name,
            temp: weatherResponse.data.current_weather.temperature,
            description: weatherResponse.data.current_weather.weathercode
        });

    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

module.exports = app;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
