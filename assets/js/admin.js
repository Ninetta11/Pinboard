// Globals
let loading = false;
const apiKey = "hoTgr9OUIYENlkzXxrIn3Mnx0mFUbggkcMprba6L";
const apiSuffix = `?auth=${apiKey}`;
const apiUrlPrefix = "https://pinboard-5f12a.firebaseio.com/";

// Elements
const adminContainerEl = document.querySelector(".admin-container");
const sidebarItemsEl = document.querySelector(".sidebar-items");
const adminPanelEl = document.querySelector(".admin-panel");
const usernameEl = document.getElementById("username");
const signOutEl = document.getElementById("signout-button");

// Functions
const updateActive = (item) => {
  const prevActiveItemEl = document.querySelector(".active");
  prevActiveItemEl.classList.remove("active");
  const activeItemEl = document.querySelector(
    `.sidebar-item[data-target=${item}]`
  );
  activeItemEl.classList.add("active");
};

const renderAdminItem = (adminItem) => {
  adminPanelEl.setAttribute("src", `${adminItem}.html`);
};

const adminHandler = (adminItem) => {
  updateActive(adminItem);
  renderAdminItem(adminItem);
};

const hideAdmin = () => {
  adminContainerEl.style.display = "none";
};

const showAdmin = () => {
  adminContainerEl.style.display = "initial";
};

const updateUserInfo = (username) => {
  usernameEl.textContent = username;
};

const startLogin = () => {
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
      updateUserInfo(email);
      showAdmin();
    } else {
      window.location.href = "signon.html";
    }
  });
};

const logoutHandler = () => {
  firebase.auth().signOut();
};

// Event listeners
sidebarItemsEl.addEventListener("click", (event) => {
  adminHandler(event.target.getAttribute("data-target"));
});

signOutEl.addEventListener("click", () => {
  logoutHandler();
});

// Main program
hideAdmin();
startLogin();

// Testing
