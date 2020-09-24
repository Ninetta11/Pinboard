var date = document.getElementById("date");
var weather = document.getElementById("weather");
var weatherIcon = document.getElementById("weather-icon");
var temp = document.getElementById("temp");
var book = document.getElementById("book");

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


// display book details and image of cover based on input 
function displayBook() {
    var searchPhrase = "the-scarlet-letter";
    var queryURL = "http://openlibrary.org/search.json?title=" + searchPhrase;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var isbn = response.docs[0].isbn[0];
        var bookTitle = response.docs[0].title;
        var authorName = response.docs[0].author_name[0];

        var title = document.createElement("h5");
        title.textContent = bookTitle;
        var author = document.createElement("h6");
        author.textContent = authorName;
        var bookcover = document.createElement("img");
        bookcover.setAttribute("src", "http://covers.openlibrary.org/b/isbn/" + isbn + "-M.jpg");

        book.append(title, author, bookcover);
    })
};




// display current date
date.textContent = moment().format(' dddd, Do MMMM');

displayWeather();

displayBook();