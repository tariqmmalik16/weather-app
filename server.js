const express = require('express');
const path = require('path');
const app = express();

// Serve the files directly from the root folder
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/api/weather', async (req, res) => {
    const city = req.query.city;
    const apiKey = 'YOUR_API_KEY_HERE'; 

    if (!city) {
        return res.status(400).json({ error: "City is required" });
    }

    try {
        const fetch = await import('node-fetch');
        const response = await fetch.default(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        res.json({
            city: data.name,
            temp: data.main.temp,
            weather: data.weather[0].main,
            humidity: data.main.humidity,
            wind: data.wind.speed
        });
    } catch (error) {
        res.status(500).json({ error: "Could not fetch weather data" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
