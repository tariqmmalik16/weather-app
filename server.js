const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.sendFile('C:\\Users\\TARIQ\\Desktop\\weather app\\index.html');
});

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    const API_KEY = 'acdf2584e385d730bb6e7d49ba0a006e';

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        res.json({
            city: response.data.name,
            country: response.data.sys.country,
            temp: Math.round(response.data.main.temp),
            icon: getIcon(response.data.weather[0].icon),
            feels_like: Math.round(response.data.main.feels_like),
            humidity: response.data.main.humidity,
            wind: Math.round(response.data.wind.speed),
            pressure: response.data.main.pressure
        });
    } catch {
        res.json({ error: 'City not found' });
    }
});

function getIcon(code) {
    const icons = {
        '01d': 'SUN',
        '01n': 'MOON',
        '02d': 'CLOUD_SUN',
        '02n': 'CLOUD_MOON',
        '03d': 'CLOUD',
        '03n': 'CLOUD',
        '04d': 'CLOUD',
        '04n': 'CLOUD',
        '09d': 'RAIN',
        '09n': 'RAIN',
        '10d': 'RAIN',
        '10n': 'RAIN',
        '11d': 'STORM',
        '11n': 'STORM',
        '13d': 'SNOW',
        '13n': 'SNOW'
    };
    return icons[code] || 'CLOUD';
}

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});