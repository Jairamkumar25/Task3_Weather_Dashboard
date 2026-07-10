// ===========================
// Nature Image Carousel
// ===========================

const images = [
    "images/image1.jpg",
    "images/image2.jpg",
    "images/image3.jpg",
    "images/image4.jpg",
    "images/image5.jpg"
];

let currentImage = 0;

const slider = document.getElementById("slider");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

function showImage() {
    slider.src = images[currentImage];
}

// Show first image
showImage();

// Next Image
nextBtn.addEventListener("click", function () {

    currentImage++;

    if (currentImage >= images.length) {
        currentImage = 0;
    }

    showImage();

});

// Previous Image
prevBtn.addEventListener("click", function () {

    currentImage--;

    if (currentImage < 0) {
        currentImage = images.length - 1;
    }

    showImage();

});

// Auto Slide every 3 seconds
setInterval(function () {

    currentImage++;

    if (currentImage >= images.length) {
        currentImage = 0;
    }

    showImage();

}, 3000);


// ===========================
// Weather Dashboard
// ===========================

const cityInput = document.getElementById("cityInput");
const weatherBtn = document.getElementById("weatherBtn");
const weatherResult = document.getElementById("weatherResult");

// Search by Button
weatherBtn.addEventListener("click", getWeather);

// Search by Enter Key
cityInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {
        getWeather();
    }

});

// Convert Weather Code to Text
function getWeatherInfo(code) {

    if (code === 0) {
        return { icon: "☀️", text: "Clear Sky" };
    }

    if (code === 1 || code === 2) {
        return { icon: "🌤", text: "Partly Cloudy" };
    }

    if (code === 3) {
        return { icon: "☁️", text: "Cloudy" };
    }

    if (code === 45 || code === 48) {
        return { icon: "🌫", text: "Fog" };
    }

    if (code >= 51 && code <= 67) {
        return { icon: "🌦", text: "Drizzle" };
    }

    if (code >= 71 && code <= 77) {
        return { icon: "❄️", text: "Snow" };
    }

    if (code >= 80 && code <= 82) {
        return { icon: "🌧", text: "Rain" };
    }

    if (code >= 95) {
        return { icon: "⛈", text: "Thunderstorm" };
    }

    return { icon: "🌍", text: "Weather Updated" };

}

// Fetch Weather
async function getWeatherData() {

    const city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    weatherResult.innerHTML =
        "<p class='message'>⏳ Fetching latest weather...</p>";

    try {

        // Find City Coordinates
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
        );

        const geoData = await geoResponse.json();

        if (!geoData.results) {

            weatherResult.innerHTML =
                "<p class='message'>❌ City not found.</p>";

            return;
        }

        const latitude = geoData.results[0].latitude;
        const longitude = geoData.results[0].longitude;

        const cityName = geoData.results[0].name;
        const country = geoData.results[0].country;

        // Fetch Weather
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
        );

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        const weather = getWeatherInfo(current.weather_code);

        weatherResult.innerHTML = `

            <h3 style="text-align:center; margin-bottom:8px;">
                📍 ${cityName}, ${country}
            </h3>

            <p style="text-align:center; color:#666; margin-bottom:20px;">
                Today's Weather Report
            </p>

            <div class="weather-grid">

                <div class="weather-box">
                    <h3>🌡 Temperature</h3>
                    <p>${current.temperature_2m} °C</p>
                </div>

                <div class="weather-box">
                    <h3>💧 Humidity</h3>
                    <p>${current.relative_humidity_2m}%</p>
                </div>

                <div class="weather-box">
                    <h3>🌬 Wind Speed</h3>
                    <p>${current.wind_speed_10m} km/h</p>
                </div>

                <div class="weather-box">
                    <h3>${weather.icon} Weather</h3>
                    <p>${weather.text}</p>
                </div>

            </div>

        `;

    }

    catch (error) {

        weatherResult.innerHTML =
            "<p class='message'>❌ Unable to fetch weather. Please try again.</p>";

    }

}

// Call Function
function getWeather() {
    getWeatherData();
}
