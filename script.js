const searchBox = document.getElementById('searchBox');
const cityEl = document.getElementById('city');
const dateEl = document.getElementById('date');
const tempEl = document.getElementById('temp');
const weatherEl = document.getElementById('weather');
const hiLowEl = document.getElementById('hi-low');

// Set today's date
const now = new Date();
const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
dateEl.innerText = now.toLocaleDateString('en-US', dateOptions);

searchBox.addEventListener('keypress', setQuery);

function setQuery(evt) {
    if (evt.keyCode == 13) {
        getResults(searchBox.value);
    }
}

async function getResults(query) {
    try {
        // Step 1: Geocoding API to get lat/lon for the city
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=1&language=en&format=json`);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            cityEl.innerText = "City not found";
            tempEl.innerText = "--";
            weatherEl.innerText = "--";
            hiLowEl.innerText = "-- / --";
            return;
        }

        const city = geoData.results[0];
        const lat = city.latitude;
        const lon = city.longitude;
        const cityName = `${city.name}, ${city.country_code}`;

        // Step 2: Weather API to get current weather
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);
        const weatherData = await weatherResponse.json();

        const currentTemp = Math.round(weatherData.current_weather.temperature);
        const maxTemp = Math.round(weatherData.daily.temperature_2m_max[0]);
        const minTemp = Math.round(weatherData.daily.temperature_2m_min[0]);
        
        // Map WMO Weather interpretation codes
        const weathercode = weatherData.current_weather.weathercode;
        const weatherStr = getWeatherString(weathercode);

        cityEl.innerText = cityName;
        tempEl.innerText = currentTemp;
        weatherEl.innerText = weatherStr;
        hiLowEl.innerText = `${minTemp}°c / ${maxTemp}°c`;
        searchBox.value = '';

    } catch (error) {
        console.error("Error fetching weather:", error);
        cityEl.innerText = "Error fetching data";
    }
}

function getWeatherString(code) {
    if (code === 0) return 'Clear sky';
    if (code === 1 || code === 2 || code === 3) return 'Partly cloudy';
    if (code === 45 || code === 48) return 'Fog';
    if (code >= 51 && code <= 55) return 'Drizzle';
    if (code >= 61 && code <= 65) return 'Rain';
    if (code >= 71 && code <= 77) return 'Snow';
    if (code >= 80 && code <= 82) return 'Rain showers';
    if (code >= 95) return 'Thunderstorm';
    return 'Unknown';
}
