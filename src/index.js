function formatMonth() {
  let date = new Date();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[date.getMonth()];
  let day = date.getDate();

  return `${month} ${day}`;
}

function formatMonthDaysForecast(timestamp) {
  let date = new Date(timestamp * 1000);
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[date.getMonth()];
  let day = date.getDate();

  return `${month} ${day}`;
}

function formateDate() {
  let nowDate = new Date();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[nowDate.getDay()];
  let hours = nowDate.getHours();
  if (hours < 10) {
    hours = "0" + hours;
  }
  let minutes = nowDate.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecastWeather(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#card-group");
  let forecastHTML = "";
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
	    <div class="card">
          <div class="card-body">
            <h5 class="card-title-dayweek">${formatDay(forecastDay.dt)}</h5>
            <h5 class="card-title-date">${formatMonthDaysForecast(
              response.data.daily[index].dt
            )}</h5>
            <img
              src="http://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png"
              alt=""
              width="75"
            />
            <div class="card-temperature">
              <span class="card-temperature-max">  ${Math.round(
                forecastDay.temp.max
              )}° </span>
              <span class="card-temperature-min">  ${Math.round(
                forecastDay.temp.min
              )}° </span>
            </div>
          </div>
		  </div>
	`;
    }
  });

  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "41c8677f21e466c9b152647e17c8d1ac";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecastWeather);
}

function showTemperature(response) {
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let cityTemperature = document.querySelector("#id-temperature");
  let cityName = document.querySelector("#current-city");
  let monthDay = document.querySelector("#month-day");
  let currentDateTime = document.querySelector("#current-date");
  let cityDescription = document.querySelector("#current-description");
  let cityHumidity = document.querySelector("#humidity");
  let cityWind = document.querySelector("#wind");
  let cityIcon = document.querySelector("#icon");

  celsiusTemperature = response.data.main.temp;

  cityTemperature.innerHTML = Math.round(response.data.main.temp);
  cityName.innerHTML = response.data.name;
  monthDay.innerHTML = formatMonth();
  currentDateTime.innerHTML = formateDate();
  cityDescription.innerHTML = response.data.weather[0].description;
  cityHumidity.innerHTML = response.data.main.humidity;
  cityWind.innerHTML = response.data.wind.speed;
  cityIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  cityIcon.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "41c8677f21e466c9b152647e17c8d1ac";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(url).then(showTemperature);
}

function currentCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#input-city");
  searchCity(cityInput.value);
}

function calculateFahrenheitTemperature(event) {
  event.preventDefault();

  let cityTemperature = document.querySelector("#id-temperature");
  //remove and add the active class
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");

  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  cityTemperature.innerHTML = Math.round(fahrenheitTemperature);
}

function calculateCelsiusTemperature(event) {
  event.preventDefault();
  //remove and add the active class
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let cityTemperature = document.querySelector("#id-temperature");
  cityTemperature.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#id-fahrenheit");
fahrenheitLink.addEventListener("click", calculateFahrenheitTemperature);

let celsiusLink = document.querySelector("#id-celsius");
celsiusLink.addEventListener("click", calculateCelsiusTemperature);

let findCity = document.querySelector("#find-city");
findCity.addEventListener("submit", currentCity);

searchCity("Kharkiv");
