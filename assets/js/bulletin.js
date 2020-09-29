var yearGroupEl = document.getElementById("year-group");
var dateEl = document.getElementById("date");
var weatherEl = document.getElementById("weather");
var weatherIconEl = document.getElementById("weather-icon");
var tempEl = document.getElementById("temp");
var welcomeEl = document.getElementById("welcome");
var timetableEl = document.getElementById("timetable");
var noticeEl = document.getElementById("notices");
var activitiesEl = document.getElementById("activities");
var canteenEl = document.getElementById("canteen");
var bookEl = document.getElementById("book");

var conditions = "";
var currentTemp = "";
var weatherMessage = "";
var loading = false;

var schoolName = "";
var city = "sydney";
var selectedClass = "";
var classtimes = ["9:00am", "9:45am", "10:30am", "10:50am", "11:30pm", "12:15pm", "1:00pm", "1:45pm", "2:30pm"];


// display current date
function displayDate() {
    date.textContent = moment().format('dddd, Do MMMM');
}

// retrieves selected class from URL 
function getClass() {
    let params = new URLSearchParams(document.location.search.substring(1));
    selectedClass = params.get("yg");
    getSchoolData();
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
        weatherIconEl.setAttribute("src", "http://openweathermap.org/img/wn/" + weatherCondition + "@2x.png");
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
}

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
        displayActivities(response);
        displayCanteenMenu(response);
    })
}

// retrieves specific class information based on selection 
function getClassInfo(schoolData) {
    var items = schoolData.classes;
    for (var key in items) {
        if (key === selectedClass) {
            var classData = schoolData.classes[key];
            displayWelcome(classData.name);
            displayTimetable(classData);
            displayBook(classData);
        }
    }
}

// displays welcome message to specific class based on time of day and weather
function displayWelcome(group) {
    // set year group on navbar
    yearGroupEl.textContent = group;

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

    // displays welcome message
    var welcomeMessage = document.createElement("h3");
    var weatherAlert = document.createElement("h4");
    var scheduleHeading = document.createElement("h5");
    scheduleHeading.textContent = "Today's Timetable";
    var newLine = document.createElement("hr");
    welcomeMessage.textContent = greeting + " " + group;
    weatherAlert.textContent = weatherMessage;
    welcomeEl.append(welcomeMessage, weatherAlert, newLine, scheduleHeading);
}

// displays selected classes schedule
function displayTimetable(classData) {
    for (var i = 0; i < classData.timetable.length; i++) {

        var list = document.createElement("tr");
        var classTime = document.createElement("td");
        var newClass = document.createElement("th");

        classTime.innerHTML = '<i class="' + "far fa-bell timetable" + '" style="color:blue"></i> ' + classtimes[i];
        newClass.textContent = classData.timetable[i];

        list.append(classTime, newClass)
        timetableEl.append(list);
    }
}

// displays all school important notices
function displayNotices(schoolData) {
    var items = Object.values(schoolData.notices);
    for (var i = 0; i < items.length; i++) {
        var newNotice = items[i].noticeContent;
        var list = document.createElement("h5");
        list.innerHTML = '<i class="' + "fas fa-exclamation" + '" style="color:red"></i> ' + newNotice;
        var newLine = document.createElement("br");
        noticeEl.prepend(list, newLine);
    }
}

// displays all school extra curricula activities
function displayActivities(schoolData) {
    var items = Object.values(schoolData.activities);
    for (var i = 0; i < items.length; i++) {

        // changing date format for display
        var dateEntered = items[i].date;
        var originaldate = moment(dateEntered, "YYYY-MM-D");
        var formattedDate = originaldate.format("DD/MM");

        // changing time format for display
        var timeEntered = items[i].time;
        var originalTime = moment(timeEntered, "hh:mm");
        var time = originalTime.format("LT");

        // adds actvity to activities display board
        var newNoticeMain = document.createElement("tr");
        var newNoticeSecond = document.createElement("tr");
        var blank = document.createElement("td");
        var newLine = document.createElement("br");
        var heading = document.createElement("th");
        heading.innerHTML = '<i class="' + "far fa-star" + '" style="color:green"></i> ' + formattedDate;
        var event = document.createElement("th");
        event.textContent = items[i].name;
        var subheading = document.createElement("td");
        subheading.textContent = time + " @ " + items[i].location;

        newNoticeMain.append(heading, event);
        newNoticeSecond.append(blank, subheading, newLine)
        activitiesEl.prepend(newNoticeMain, newNoticeSecond);
    };
}

// displays canteen menu
function displayCanteenMenu(schoolData) {
    var items = Object.values(schoolData.canteenItems);
    for (var i = 0; i < items.length; i++) {

        var item = document.createElement("tr");
        var menuItem = document.createElement("td");
        var itemPrice = document.createElement("td");

        menuItem.textContent = items[i].name;
        itemPrice.textContent = "$" + items[i].price;

        item.append(menuItem, itemPrice)
        canteenEl.prepend(item);
    }
}

// display book details and image of cover based on class input
function displayBook(classData) {
    showSpinner(bookEl);
    var searchTitle = classData.book.name;
    var searchPhrase = searchTitle.replace(/ /g, "-");
    var searchAuthor = classData.book.author;
    var queryURL = "https://openlibrary.org/search.json?title=" + searchPhrase;
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

                clearSpinner(bookEl);
                bookEl.append(title, author, bookcover);
                break;
            }
            else {
                // if book cannot be found in open library API, displays details entered from admin page
                var title = document.createElement("h5");
                title.textContent = searchTitle;
                var author = document.createElement("h6");
                author.textContent = searchAuthor;
                clearSpinner(bookEl);
                bookEl.append(title, author);
            }
        }
    })
};

function showSpinner(target) {
    loading = true;
    var spinnerEl = document.createElement("div");
    var spinnerContainerEl = document.createElement("div");
    spinnerEl.classList.add("spinner-border", "text-secondary");
    spinnerEl.setAttribute("role", "status");
    spinnerContainerEl.setAttribute("class", "my-2 my-sm-0 spinner-container");
    spinnerContainerEl.appendChild(spinnerEl);
    target.appendChild(spinnerContainerEl);
};

function clearSpinner(target) {
    target.innerHTML = "";
};

displayDate();
displayWeather();
getClass();


