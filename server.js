const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (like index.html)
app.use(express.static(__dirname));

// Show the index.html page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API Route using Vercel's built-in Fetch (No axios needed)
app.get('/api/weather', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }

    try {
        // Find city coordinates using Open-Meteo
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            return res.status(404).json({ error: 'City not found. Please try again.' });
        }

        const { latitude, longitude, name } = geoData.results[0];

        // Get weather for those coordinates
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const weatherData = await weatherResponse.json();

        res.json({
            name: name,
            temp: weatherData.current_weather.temperature,
            description: weatherData.current_weather.weathercode
        });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: 'Server error, please try again' });
    }
});

module.exports = app;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
