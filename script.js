function setThemeBasedOnTime() {
  const currentHour = new Date().getHours();
  const body = document.body;
  const weatherIcon = document.getElementById("weather-icon");
  if (currentHour >= 17 || currentHour < 6) {
    body.classList.add("dark-mode");
    weatherIcon.src = "assets/night.png";
  } else {
    body.classList.remove("dark-mode");
  }
  console.log(currentHour);
}

window.onload = setThemeBasedOnTime;

// Fungsi untuk fetch data cuaca berdasarkan lokasi (termasuk forecast)
const fetchWeatherData = async (location) => {
  const apiKey = "98d0886447e4435b98d110407242609";
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=7&aqi=no&alerts=no`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Gagal mengambil data");
    }
    const weatherData = await response.json();
    console.log(weatherData);
    updateWeatherInfo(weatherData);
    updateWeeklyForecast(weatherData.forecast.forecastday);
  } catch (error) {
    console.log("Terjadi kesalahan:", error);
  }
};

fetchWeatherData("Jakarta");

const updateWeatherInfo = (data) => {
  document.querySelector(".city-name").textContent = data.location.name;
  document.querySelector(".date-time").textContent = new Date(
    data.location.localtime
  ).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  document.querySelector(
    ".current-temperature"
  ).textContent = `${data.current.temp_c}°C`;
  document.querySelector(".current-condition").textContent =
    data.current.condition.text;

  const weatherIcon = document.querySelector("#weather-icon");
  weatherIcon.src = data.current.condition.icon;
  weatherIcon.alt = data.current.condition.text;
};

const updateWeeklyForecast = (forecastDays) => {
  const weatherList = document.querySelector(".weather-list");
  weatherList.innerHTML = "";

  forecastDays.forEach((day) => {
    const date = new Date(day.date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    const temperature = `${day.day.avgtemp_c}°C`;
    const condition = day.day.condition.text;

    const weatherItem = document.createElement("article");
    weatherItem.classList.add("weather-item");

    weatherItem.innerHTML = `
    <h1 class="temperature">${temperature}</h1>
    <p class="date-time">${date}</p>
    <p class="condition">${condition}</p>
    `;

    weatherList.appendChild(weatherItem);
  });
};

const searchButton = document.getElementById("search-button");
const locationInput = document.getElementById("location-search");

searchButton.addEventListener("click", () => {
  const location = locationInput.value.trim();
  console.log("Lokasi yang dicari:", location); // Tambahkan ini
  if (location) {
    fetchWeatherData(location);
  } else {
    alert("Enter a location");
  }
});
