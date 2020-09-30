// Globals
let loading = false;
const apiKey = "hoTgr9OUIYENlkzXxrIn3Mnx0mFUbggkcMprba6L";
const apiSuffix = `?auth=${apiKey}`;
const apiUrlPrefix = "https://pinboard-5f12a.firebaseio.com/";

// Elements
const adminContainerEl = document.querySelector(".admin-container");
const alertContainerEl = document.querySelector(".alert-container");
const spinnerContainerEl = document.querySelector(".spinner-container");
const modalEl = document.querySelectorAll(".modal");

// Functions
const clearAlert = () => {
  alertContainerEl.innerHTML = "";
};

const clearSpinner = () => {
  spinnerContainerEl.innerHTML = "";
};

const closeModal = () => {
  document.querySelector(".modal-backdrop").remove();
  modalEl.forEach((el) => {
    el.classList.remove("show");
  });
};

const alertHandler = (message, status) => {
  const alertEl = document.createElement("div");
  alertEl.setAttribute("role", "alert");
  alertEl.classList.add("alert", "alert-dismissable", "fade", "show");

  switch (status) {
    case "ERROR":
      alertEl.classList.add("alert-danger");
      alertEl.textContent = `An error occured with status: ${message}`;
      break;
    case "SUCCESS":
      alertEl.classList.add("alert-success");
      alertEl.textContent = `Operation success with status: ${message}`;
      break;
    default:
      alertEl.classList.add("alert-primary");
      alertEl.textContent = message;
  }

  const dismissAlertEl = document.createElement("button");
  dismissAlertEl.type = "button";
  dismissAlertEl.classList.add("close");
  dismissAlertEl.setAttribute("data-dismiss", "alert");
  const dismissButtonEl = document.createElement("span");
  dismissButtonEl.innerHTML = "&times;";
  dismissAlertEl.appendChild(dismissButtonEl);
  alertEl.appendChild(dismissAlertEl);

  alertContainerEl.appendChild(alertEl);
};

const getCollection = (type) => {
  switch (type) {
    case "NOTICE":
      return "notices";
      break;
    case "CANTEEN":
      return "canteenItems";
      break;
    case "ACTIVITIES":
      return "activities";
      break;
    case "YEAR_GROUP":
      return "classes";
      break;
  }
};

const addHandler = (type) => {
  showSpinner();
  const collection = getCollection(type);
  let body = "";
  switch (type) {
    case "NOTICE":
      body = {
        noticeContent: noticeTextEl.value,
      };
      break;
    case "CANTEEN":
      body = {
        name: canteenItemNameEl.value,
        price: canteenItemPriceEl.value,
      };
      break;
    case "ACTIVITIES":
      body = {
        name: activityNameEl.value,
        location: activityLocationEl.value,
        date: activityDateEl.value,
        time: activityTimeEl.value,
      };
      break;
    case "YEAR_GROUP":
      body = {
        name: yearGroupNameEl.value,
        timetable: [],
        book: "",
      };
      break;
  }
  const queryUrl = apiUrlPrefix + `${collection}.json` + apiSuffix;
  fetch(queryUrl, {
    method: "POST",
    body: JSON.stringify(body),
  }).then((res) => {
    alertHandler(res.statusText, "SUCCESS");
    closeModal();
    refreshAdmin();
    clearSpinner();
  });
};

// Delete handler
const deleteHandler = (id, type) => {
  showSpinner();
  const collection = getCollection(type);

  const queryUrl = apiUrlPrefix + `${collection}/${id}.json` + apiSuffix;
  fetch(queryUrl, {
    method: "DELETE",
  }).then((res) => {
    alertHandler(res.statusText, "SUCCESS");
    refreshAdmin();
    clearSpinner();
  });
};

// Fetch data
const fetchData = (type) => {
  if (!loading) {
    loading = true;
    showSpinner();
  }
  const collection = getCollection(type);
  const queryUrl = apiUrlPrefix + `${collection}.json` + apiSuffix;
  fetch(queryUrl)
    .then((res) => res.json())
    .then((data) => {
      for (let key in data) {
        switch (type) {
          case "NOTICE":
            notices.push({
              ...data[key],
              id: key,
            });
            break;
          case "CANTEEN":
            canteenItems.push({
              ...data[key],
              id: key,
            });
            break;
          case "ACTIVITIES":
            activities.push({
              ...data[key],
              id: key,
            });
            break;
          case "YEAR_GROUP":
            yearGroups.push({
              ...data[key],
              id: key,
            });
            break;
        }
      }
      renderData(type);
      loading = false;
      clearSpinner();
    });
};

// Render data
const renderData = (type) => {
  switch (type) {
    case "NOTICE":
      notices.forEach((notice) => {
        createNoticeRow(notice);
      });
      break;
    case "CANTEEN":
      canteenItems.forEach((item) => {
        createCanteenRow(item);
      });
      break;
    case "ACTIVITIES":
      activities.forEach((item) => {
        createActivityRow(item);
      });
      break;
    case "YEAR_GROUP":
      yearGroups.forEach((yearGroup) => {
        createYearGroupRow(yearGroup);
      });
      break;
  }
};

const showSpinner = () => {
  loading = true;
  const spinnerEl = document.createElement("div");
  spinnerEl.classList.add("spinner-border", "text-secondary");
  spinnerEl.setAttribute("role", "status");
  spinnerContainerEl.appendChild(spinnerEl);
};

const hideAdmin = () => {
  adminContainerEl.style.display = "none";
};

const showAdmin = () => {
  adminContainerEl.style.display = "initial";
};

const startLogin = (type) => {
  const firebaseConfig = {
    apiKey: "AIzaSyBnhiM0nSJJ4uZgQhtb2hxX5p9d7pZF6C8",
    authDomain: "pinboard-5f12a.firebaseapp.com",
    databaseURL: "https://pinboard-5f12a.firebaseio.com",
    projectId: "pinboard-5f12a",
    storageBucket: "pinboard-5f12a.appspot.com",
    messagingSenderId: "561182051067",
    appId: "1:561182051067:web:82909361b13e9e8209be5e",
  };
  firebase.initializeApp(firebaseConfig);
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in.
      const displayName = user.displayName;
      const email = user.email;
      const emailVerified = user.emailVerified;
      const photoURL = user.photoURL;
      const isAnonymous = user.isAnonymous;
      const uid = user.uid;
      const providerData = user.providerData;
      //updateUserInfo(email);
      showAdmin();
      fetchData(type);
    } else {
      window.location.href = "signon.html";
    }
  });
};

// Event listeners
alertContainerEl.addEventListener("click", () => {
  clearAlert();
});

// Main program

// Testing
