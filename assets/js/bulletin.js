var yearGroup = document.getElementById("year-group");
var date = document.getElementById("date");
var weather = document.getElementById("weather");
var weatherIcon = document.getElementById("weather-icon");
var temp = document.getElementById("temp");
var welcome = document.getElementById("welcome");
var timetable = document.getElementById("timetable");
var notice = document.getElementById("notices");
var activities = document.getElementById("activities");
var canteen = document.getElementById("canteen");
var book = document.getElementById("book");
var messages = document.getElementById("message-board");

var conditions = "";
var currentTemp = "";
var weatherMessage = "";

var schoolName = "";
var city = "sydney";
var selectedClass = "Class 3M";
var classtimes = ["9:00am", "9:45am", "10:30am", "11:15am", "12:30pm", "1:15pm", "2:00pm", "2:45pm"];


// display current date
function displayDate() {
    date.textContent = moment().format(' dddd, Do MMMM');
}

// display weather details based on current day
function displayWeather() {
    var openWeatherURL = "https://api.openweathermap.org/";
    var apiKey = "be7a39895621e97d4b83ace8f5bc938f";
    var queryURL = openWeatherURL + "data/2.5/weather?q=" + city + "&units=metric&appid=" + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var weatherCondition = response.weather[0].icon;
        currentTemp = response.main.temp;
        conditions = response.weather[0].main;
        weatherIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + weatherCondition + "@2x.png");
        temp.textContent = "Temp: " + Math.round(currentTemp) + "\u00B0C";

        // weather based alert
        if (conditions === "Thunderstorm" || conditions === "Rain" || conditions === "Drizzle") {
            weatherMessage = "Don't forget your umbrella today!"
        }
        else if (conditions === "Clear" && currentTemp > 20) {
            weatherMessage = "Don't forget your sunscreen and hat today!"
        }
        else if (conditions === "Clear" || conditions === "Clouds" && currentTemp < 20) {
            weatherMessage = "Don't forget to rug up today!"
        }
        else {
            weatherMessage = "Be careful out there today!"
        }
    });
};

// retrieves data from content API
function getSchoolData() {
    var contentURL = "https://pinboard-5f12a.firebaseio.com/.json";
    var apikey = "?auth=hoTgr9OUIYENlkzXxrIn3Mnx0mFUbggkcMprba6L";
    var queryURL = contentURL + apikey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        getClassInfo(response);
        displayNotices(response);
        //displayActivities(reponse);
        //displayCanteenMenu(response);
    })
}

// retrieves specific class information based on selection 
function getClassInfo(schoolData) {
    var items = Object.values(schoolData.classes);
    for (var i = 0; i < items.length; i++) {
        var group = items[i].name;
        if (group === selectedClass) {
            var classData = items[i];
            displayWelcome(group);
            displayTimetable(classData);
            //displayBook(classData);
            //displayMessageBoard(classData);
        }
    }
}

// displays welcome message to specific class based on time of day and weather
function displayWelcome(group) {
    // set year group on navbar
    yearGroup.textContent = group;

    // greeting based on time of day
    var greeting = "";
    var currentTime = parseFloat(moment().format("HH"));
    if (currentTime <= 12) {
        greeting = "Good morning";
    }
    else if (currentTime >= 17) {
        greeting = "Good evening";
    }
    else {
        greeting = "Good afternoon";
    };

    var newNotice = greeting + " " + group + " \n " + weatherMessage;
    var list = document.createElement("h4");
    list.textContent = newNotice;
    welcome.append(list);
}

// displays selected classes schedule
function displayTimetable(classData) {
    for (var i = 0; i < classData.timetable.length; i++) {
        var newNotice = classData.timetable[i];
        var list = document.createElement("p");
        list.textContent = classtimes[i] + " " + newNotice;
        timetable.append(list);
    }
}

// displays all school important notices
function displayNotices(schoolData) {
    var items = Object.values(schoolData.notices);
    for (var i = 0; i < items.length; i++) {
        var newNotice = items[i].noticeContent;
        var list = document.createElement("p");
        list.textContent = newNotice;
        notice.prepend(list);
    }
}

// displays all school extra curricula activities
function displayActivities(schoolData) {
    var items = Object.values(schoolData.activities);
    for (var i = 0; i < items.length; i++) {
        var list = document.createElement("p");
        var newNotice = items[i].activity;
        list.textContent = newNotice;
        activities.prepend(list);
    }
}

// displays canteen menu
function displayCanteenMenu(schoolData) {
    var items = Object.values(schoolData.canteenItems);
    for (var i = 0; i < items.length; i++) {
        var list = document.createElement("p");
        var newNotice = items[i].itemContent;
        list.textContent = newNotice;
        canteen.prepend(list);
    }
}

// display book details and image of cover based on class input
function displayBook(classData) {
    var searchTitle = classData.book.title;
    var searchPhrase = searchTitle.replace(" ", "-");
    console.log(searchPhrase);
    var searchAuthor = schoolData.book.author;
    var queryURL = "http://openlibrary.org/search.json?title=" + searchPhrase;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        for (var i = 0; response.docs.length; i++) {
            var authorName = response.docs[i].author_name[0];

            if (authorName === searchAuthor) {
                var isbn = response.docs[i].isbn[0];
                var bookTitle = response.docs[i].title;

                var title = document.createElement("h5");
                title.textContent = bookTitle;
                var author = document.createElement("h6");
                author.textContent = authorName;
                var bookcover = document.createElement("img");
                bookcover.setAttribute("src", "http://covers.openlibrary.org/b/isbn/" + isbn + "-M.jpg");

                book.append(title, author, bookcover);
                break;
            }
        }
    })
};

function displayMessageBoard(classData) {
    var items = Object.values(classData.messages);
    for (var i = 0; i < items.length; i++) {
        var newNotice = Object.values(items[i].messages);
        var list = document.createElement("p");
        list.textContent = newNotice;
        messages.prepend(list);
    }
};


displayDate();
displayWeather();
getSchoolData();


