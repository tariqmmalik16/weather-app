const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the static HTML file
app.use(express.static(path.join(__dirname)));

// API Route to get weather
app.get('/api/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }

    try {
        // Note: You usually need an API key for this. 
        // If you don't have one, use this free test endpoint (it might be limited)
        const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=33.68&longitude=73.04&current_weather=true`);
        
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
