const API_KEY = 'acdf2584e385d730bb6e7d49ba0a006e';

document.getElementById('searchBtn').onclick = getWeather;
document.getElementById('city').onkeypress = function(e) {
    if (e.key === 'Enter') getWeather();
};

async function getWeather() {
    const city = document.getElementById('city').value;
    if (!city) return;

    try {
        const res = await fetch(`http://localhost:3000/weather?city=${city}`);
        const data = await res.json();

        if (data.error) {
            document.getElementById('error').classList.remove('hidden');
            return;
        }

        document.getElementById('error').classList.add('hidden');
        
        // Display all weather data
        document.getElementById('icon').textContent = data.icon;
        document.getElementById('temp').textContent = data.temp + '°C';
        document.getElementById('name').textContent = data.city + ', ' + data.country;
        
        // ✅ ADD THESE 4 LINES TO SHOW THE MISSING DATA:
        document.getElementById('feelsLike').textContent = data.feels_like + '°C';
        document.getElementById('humidity').textContent = data.humidity + '%';
        document.getElementById('windSpeed').textContent = data.wind + ' km/h';
        document.getElementById('pressure').textContent = data.pressure + ' hPa';
        
    } catch {
        document.getElementById('error').classList.remove('hidden');
    }
}