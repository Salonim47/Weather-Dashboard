const searchBox = document.getElementById('searchBox');
const cityEl = document.getElementById('city');
const dateEl = document.getElementById('date');
const tempEl = document.getElementById('temp');
const weatherEl = document.getElementById('weather');
const hiLowEl = document.getElementById('hi-low');

// Mock data to simulate API responses for aesthetic purposes
const mockWeatherData = {
    'new york': { temp: 15, hi: 18, low: 10, weather: 'Cloudy' },
    'london': { temp: 12, hi: 15, low: 8, weather: 'Rainy' },
    'tokyo': { temp: 22, hi: 26, low: 18, weather: 'Clear' },
    'sydney': { temp: 28, hi: 32, low: 22, weather: 'Sunny' }
};

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

function getResults(query) {
    const cityKey = query.toLowerCase();
    
    // Simulate API fetch delay
    setTimeout(() => {
        if (mockWeatherData[cityKey]) {
            const data = mockWeatherData[cityKey];
            cityEl.innerText = query.charAt(0).toUpperCase() + query.slice(1);
            tempEl.innerText = data.temp;
            weatherEl.innerText = data.weather;
            hiLowEl.innerText = `${data.low}°c / ${data.hi}°c`;
            searchBox.value = '';
        } else {
            // Generate random plausible data for unknown cities
            const rTemp = Math.floor(Math.random() * 35);
            cityEl.innerText = query.charAt(0).toUpperCase() + query.slice(1);
            tempEl.innerText = rTemp;
            weatherEl.innerText = rTemp > 20 ? 'Sunny' : 'Cloudy';
            hiLowEl.innerText = `${rTemp - 5}°c / ${rTemp + 5}°c`;
            searchBox.value = '';
        }
    }, 300);
}
