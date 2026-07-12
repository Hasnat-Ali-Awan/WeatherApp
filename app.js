const API_KEY = "1455dad9a1e8c1c3b3a820affcff1ed6";

const searchBox = document.getElementById("searchBox");
const searchButton = document.getElementById("searchButton");

const cityName = document.getElementById("cityName");
const dateTime = document.getElementById("dateTime");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");

const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");

const loading = document.getElementById("loading");
const error = document.getElementById("error");


searchButton.addEventListener("click", () => {
    getWeather();
});

searchBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        getWeather();
    }
});

const refreshButton = document.getElementById("refreshButton");

refreshButton.addEventListener("click", () => {
    getWeather();
});
async function getWeather() {

    const city = searchBox.value.trim();

    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    loading.classList.remove("hidden");
    error.classList.add("hidden");

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();

        displayWeather(data);

    } catch (err) {

        error.classList.remove("hidden");

    } finally {

        loading.classList.add("hidden");

    }

}



function displayWeather(data) {

    cityName.textContent =
        `${data.name}, ${data.sys.country}`;

    temperature.textContent =
        `${Math.round(data.main.temp)}°C`;

    description.textContent =
        data.weather[0].description;

    feelsLike.textContent =
        `${Math.round(data.main.feels_like)}°C`;

    humidity.textContent =
        `${data.main.humidity}%`;

    windSpeed.textContent =
        `${data.wind.speed} m/s`;

    pressure.textContent =
        `${data.main.pressure} hPa`;

    visibility.textContent =
        `${data.visibility / 1000} km`;

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    const today = new Date();

    dateTime.textContent =
        today.toLocaleString();

}