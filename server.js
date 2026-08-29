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

// API Route using your ACTIVE OpenWeatherMap key
app.get('/api/weather', async (req, res) => {
    const city = req.query.city;
    const apiKey = 'acdf2584e385d736b6e7d4d9ba0a006e';

    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }

    try {
        // Fetching data from OpenWeatherMap
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        
        // Send the exact data back to the website
        res.json({
            name: response.data.name,
            temp: response.data.main.temp,
            description: response.data.weather[0].description
        });

    } catch (error) {
        // THIS PART IS IMPORTANT: It shows us the REAL error message
        console.error("Error details:", error.message);
        if (error.response && error.response.status === 401) {
            return res.status(401).json({ error: 'Invalid API Key' });
        }
        res.status(500).json({ error: 'City not found or server error' });
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
