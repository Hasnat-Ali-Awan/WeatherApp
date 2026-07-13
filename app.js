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
let isLoading = false;
renderRecentSearches();
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
    const recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    if (recentSearches.length > 0) {
        const firstcity = recentSearches[0];
        localStorage.removeItem(firstcity);
        getWeather(firstcity);

        return;
    }

});
async function getWeather(city = searchBox.value.trim()) {
    if (isLoading) {
        console.log("please Wait ")
        return;
    };
    isLoading = true;


    if (city === "") {
        alert("Please enter a city name.");
        isLoading = false;
        return;
    }
    const cachedData = JSON.parse(localStorage.getItem(city));

    if (cachedData) {
        let tenMinutes = 10 * 60 * 1000;


        if ((Date.now() - cachedData.time) < tenMinutes) {
            console.log("Using cache data >>>");
            saveRecentSearches(city);
            displayWeather(cachedData.data);
            renderRecentSearches();
            isLoading = false;
            return;
        } else {
            console.log("cache Expires");
            localStorage.removeItem(city);
        }
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
        const cache = {
            data: data,
            time: Date.now()
        };
        localStorage.setItem(city, JSON.stringify(cache));
        saveRecentSearches(city);
        displayWeather(data);
        renderRecentSearches();


    } catch (err) {

        error.classList.remove("hidden");

    } finally {

        loading.classList.add("hidden");
        isLoading = false;

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

function saveRecentSearches(city) {
    let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    recentSearches = recentSearches.filter(
        item => item.toLowerCase() !== city.toLowerCase()
    );

    recentSearches.unshift(city);

    recentSearches = recentSearches.slice(0, 5);

    localStorage.setItem(
        "recentSearches",
        JSON.stringify(recentSearches)
    );
}

function renderRecentSearches() {

    const container = document.getElementById("recentSearches");

    container.innerHTML = "";

    const recentSearches =
        JSON.parse(localStorage.getItem("recentSearches")) || [];

    recentSearches.forEach(city => {

        const button = document.createElement("button");

        button.textContent = city;
        button.addEventListener("click", () => {
            searchBox.value = city;
            getWeather(city);
        });
        container.appendChild(button);

    });

}