const apiKey = '6b9fe3611f9cbf9dacae0471930e5f80';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');

const cityName = document.getElementById('cityName');
const temp = document.getElementById('temp');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const visibility = document.getElementById('visibility');
const pressure = document.getElementById('pressure');
const feelsLike = document.getElementById('feelsLike');
const clouds = document.getElementById('clouds');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const localTime = document.getElementById('localTime');
const latElem = document.getElementById('lat');
const lonElem = document.getElementById('lon');
const locationMessage = document.getElementById('locationMessage');

// Auto-detect location
window.addEventListener('load', () => {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(pos => {
            const { latitude, longitude } = pos.coords;
            getWeatherByCoords(latitude, longitude);
        }, () => {
            locationMessage.textContent = "Location not allowed. Please search manually.";
        });
    } else {
        locationMessage.textContent = "Geolocation not supported. Search manually.";
    }
});

searchBtn.addEventListener('click', () => {
    if(cityInput.value.trim() !== ''){
        getWeatherByCity(cityInput.value.trim());
    }
});

function getWeatherByCity(city){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => updateWeather(data))
        .catch(() => alert("City not found!"));
}

function getWeatherByCoords(lat, lon){
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => updateWeather(data))
        .catch(() => alert("Unable to fetch weather!"));
}

function updateWeather(data){
    if(data.cod !== 200){
        alert(data.message);
        return;
    }

    locationMessage.textContent = "";

    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temp.textContent = `${Math.round(data.main.temp)}°C`;
    description.textContent = data.weather[0].main;
    humidity.textContent = data.main.humidity;
    wind.textContent = data.wind.speed;
    visibility.textContent = (data.visibility / 1000).toFixed(1);
    pressure.textContent = data.main.pressure;
    feelsLike.textContent = Math.round(data.main.feels_like);
    clouds.textContent = data.clouds.all;

    sunrise.textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    sunset.textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    const timezoneOffset = data.timezone * 1000;
    localTime.textContent = new Date(Date.now() + timezoneOffset - new Date().getTimezoneOffset()*60000).toLocaleTimeString();

    latElem.textContent = data.coord.lat;
    lonElem.textContent = data.coord.lon;
}
