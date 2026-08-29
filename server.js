const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Weather code mapping
const weatherCodes = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
};

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/weather', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }

    try {
        // Find city coordinates
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en`);
        
        if (!geoResponse.ok) {
            throw new Error('Geocoding API failed');
        }
        
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            return res.status(404).json({ error: 'City not found. Please try again.' });
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // Get weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`
        );
        
        if (!weatherResponse.ok) {
            throw new Error('Weather API failed');
        }
        
        const weatherData = await weatherResponse.json();

        if (!weatherData.current_weather) {
            throw new Error('No weather data available');
        }

        const weatherCode = weatherData.current_weather.weathercode;
        const description = weatherCodes[weatherCode] || 'Unknown weather condition';

        res.json({
            name: name,
            country: country || '',
            temp: Math.round(weatherData.current_weather.temperature),
            description: description,
            weathercode: weatherCode,
            wind: weatherData.current_weather.windspeed,
            time: weatherData.current_weather.time
        });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ 
            error: 'Server error, please try again',
            details: error.message 
        });
    }
});

module.exports = app;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
