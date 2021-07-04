function formatDate(timestamp) {
  let date = new Date(timestamp);
  let actualDate = date.getDate();
  let month = (date.getMonth()+1);
  let year = date.getFullYear();
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days [date.getDay()];
  document.querySelector("#actualDay").innerHTML = day;
  return `${actualDate}. ${month}. ${year} ${hours}:${minutes}`;
}
function formatDay(timestamp){
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let dayShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return dayShort[day]
}
function showTempNight(response) {
  let nightTemp = response.data.daily;
  nightTemp.forEach(function (forecastNight, index) {
    if (index < 1) {
       document.querySelector("#nightTemp").innerHTML = Math.round(
         forecastNight.temp.night
       );
    } 
  });
}
function showForecast(response){
  let dailyForecast = response.data.daily;
  let forecast = document.querySelector("#forecast");
  let forecastHTML = `<div class="row g-0">`;
  dailyForecast.forEach(function (forecastDay, index){
    if (index > 0 && index < 6){
  forecastHTML += `
    <div class="card-mb-3">
    <div class="row g-0">
        <div class="col-sm-4", id="forecastData">
      <div class="weatherForecastDate">${formatDay(forecastDay.dt)}</div>
      <img
        src="http://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png"
        alt=""
        width="36"
      />
      </div>
      <div class="col-sm-8">
      <div class="weatherForecastTemp">
        <span class="weatherForecastTempMax">${Math.round(
          forecastDay.temp.max
        )}°C |</span>
        <span class="weatherForecastTempMin">${Math.round(
          forecastDay.temp.min
        )}°C</span>
         </div>
       </div>
      </div>
     </div>
  `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
forecast.innerHTML = forecastHTML;
}
function getForecast(coords){
let apiKey = "d161f604274c06b1e5ec41b1728c9abc";
let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`;
axios.get(apiUrl).then(showTempNight);
axios.get(apiUrl).then(showForecast);
}
function showTemperature(response) {
  celsiusTemp = response.data.main.temp;
  document.querySelector("#dayTemp").innerHTML = Math.round(celsiusTemp);
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    3.6 * response.data.wind.speed);
  document.querySelector("#date").innerHTML = formatDate(
    response.data.dt * 1000);
    let iconElement = document.querySelector("#icon");
    iconElement.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
    iconElement.setAttribute("alt", response.data.weather[0].description);
  getForecast(response.data.coord);
}
function searchCity(city) {
  let apiKey = "d161f604274c06b1e5ec41b1728c9abc";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}
function submitSearch(event) {
  event.preventDefault();
let searchInput = document.querySelector("#search-input");
searchCity(searchInput.value);
} 
function showFahrenheitTemp(event){
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  document.querySelector("#dayTemp").innerHTML = Math.round((celsiusTemp * 9) / 5 + 32);
}
function showCelsiusTemp(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  document.querySelector("#dayTemp").innerHTML = Math.round(celsiusTemp);
}
let celsiusTemp = null;

let formInput = document.querySelector("#search-form");
formInput.addEventListener("submit", submitSearch);

let buttonInput = document.querySelector("#button");
buttonInput.addEventListener("click", submitSearch);

let fahrenheitLink = document.querySelector("#linkFahrenheitDay");
fahrenheitLink.addEventListener("click", showFahrenheitTemp);

let celsiusLink = document.querySelector("#linkCelsiusDay");
celsiusLink.addEventListener("click", showCelsiusTemp);

searchCity("Zurich");
