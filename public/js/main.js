async function getWeather() {
    const city = document.getElementById('city-input').value;
    if (!city) return alert("Please enter a city!");

    try {
        const response = await fetch(`/api/weather?city=${city}`);
        const data = await response.json();

        document.getElementById('city-name').innerText = data.city;
        document.getElementById('temp').innerText = `${data.temp}°C`;
        document.getElementById('description').innerText = data.weather;
        document.getElementById('humidity').innerText = `${data.humidity}%`;
        document.getElementById('wind').innerText = `${data.wind} km/h`;

        document.getElementById('weather-card').style.display = 'block';
    } catch (error) {
        alert("Could not fetch weather. Please try again.");
        console.error(error);
    }
}