var date = document.getElementById("date");
var weather = document.getElementById("weather");
var weatherIcon = document.getElementById("weather-icon");
var temp = document.getElementById("temp");

var openWeatherURL = "https://api.openweathermap.org/";
var apiKey = "be7a39895621e97d4b83ace8f5bc938f";
var city = "sydney";


// display current date
date.textContent = moment().format(' dddd, Do MMMM');

// display weather details based on current day
function displayWeather() {
    var queryURL = openWeatherURL + "data/2.5/weather?q=" + city + "&units=metric&appid=" + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var weatherCondition = response.weather[0].icon;
        var currentTemp = response.main.temp;
        weatherIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + weatherCondition + "@2x.png");
        temp.textContent = "Temp: " + Math.round(currentTemp) + "\u00B0C";
    });

};



// display current date
date.textContent = moment().format(' dddd, Do MMMM');

displayWeather();