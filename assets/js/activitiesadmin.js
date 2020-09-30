// Globals
let activities = [];

// Elements
const activityNameEl = document.getElementById("activityName");
const activityLocationEl = document.getElementById("activityLocation");
const activityDateEl = document.getElementById("activityDate");
const activityTimeEl = document.getElementById("activityTime");
const activityListingEl = document.querySelector(".activities-listing");
const confirmActivityEl = document.getElementById("confirmActivity");

// Functions
const clearActivities = () => {
  activities = [];
  activityListingEl.innerHTML = "";
  activityNameEl.value = "";
  activityLocationEl.value = "";
  activityDateEl.value = "";
  activityTimeEl.value = "";
};

const refreshAdmin = () => {
  clearActivities();
  fetchData("ACTIVITIES");
};

// Output activities
const createActivityRow = (item) => {
  const activityItemRowEl = document.createElement("tr");
  const activityItemNameEl = document.createElement("td");
  activityItemNameEl.setAttribute("scope", "row");
  activityItemNameEl.textContent = item.name;
  const activityItemLocationEl = document.createElement("td");
  activityItemLocationEl.setAttribute("scope", "row");
  activityItemLocationEl.textContent = item.location;
  const activityItemDateEl = document.createElement("td");
  activityItemDateEl.setAttribute("scope", "row");
  activityItemDateEl.textContent = item.date;
  const activityItemTimeEl = document.createElement("td");
  activityItemTimeEl.setAttribute("scope", "row");
  activityItemTimeEl.textContent = item.time;
  const activityItemConfigEl = document.createElement("td");
  activityItemConfigEl.setAttribute("scope", "row");

  const activityItemDeleteEl = document.createElement("button");
  activityItemDeleteEl.setAttribute("class", "btn btn-sm btn-danger action");
  activityItemDeleteEl.setAttribute("id", "delete-button");
  activityItemDeleteEl.setAttribute("data-value", item.id);
  activityItemDeleteEl.textContent = "Delete";

  activityItemConfigEl.appendChild(activityItemDeleteEl);
  activityItemRowEl.appendChild(activityItemNameEl);
  activityItemRowEl.appendChild(activityItemLocationEl);
  activityItemRowEl.appendChild(activityItemDateEl);
  activityItemRowEl.appendChild(activityItemTimeEl);
  activityItemRowEl.appendChild(activityItemConfigEl);
  activityListingEl.appendChild(activityItemRowEl);
};

// Event listeners
confirmActivityEl.addEventListener("click", (event) => {
  event.preventDefault();
  addHandler("ACTIVITIES");
});

activityListingEl.addEventListener("click", (event) => {
  if (event.target.id === "delete-button") {
    deleteHandler(event.target.getAttribute("data-value"), "ACTIVITIES");
  }
});

// Main
hideAdmin();
startLogin("ACTIVITIES");

// Testing
