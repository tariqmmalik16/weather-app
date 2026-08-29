const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the static HTML file
app.use(express.static(__dirname));

// API Route to get weather for a specific city
app.get('/api/weather', async (req, res) => {
    const city = req.query.city;
    const apiKey = 'acdf2584e385d736b6e7d4d9ba0a006e'; // Your active key

    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        res.json(response.data);
    } catch (error) {
        // If the city is not found, send a specific error message
        res.status(500).json({ error: 'City not found or API error' });
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
