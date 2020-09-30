// Globals
let canteenItems = [];

// Elements
const canteenItemNameEl = document.getElementById("canteenItemName");
const canteenItemPriceEl = document.getElementById("canteenItemPrice");
const canteenListingEl = document.querySelector(".canteen-listing");
const confirmCanteenEl = document.getElementById("confirmCanteen");

// Functions
const clearCanteenItems = () => {
  canteenItems = [];
  canteenListingEl.innerHTML = "";
  canteenItemNameEl.value = "";
  canteenItemPriceEl.value = "";
};

const refreshAdmin = () => {
  clearCanteenItems();
  fetchData("CANTEEN");
};

// Output canteen items
const createCanteenRow = (item) => {
  const canteenRowEl = document.createElement("tr");
  const canteenNameEl = document.createElement("td");
  canteenNameEl.setAttribute("scope", "row");
  canteenNameEl.textContent = item.name;
  const canteenPriceEl = document.createElement("td");
  canteenPriceEl.setAttribute("scope", "row");
  canteenPriceEl.textContent = item.price;
  const canteenConfigEl = document.createElement("td");
  canteenConfigEl.setAttribute("scope", "row");

  const canteenDeleteEl = document.createElement("button");
  canteenDeleteEl.setAttribute("class", "btn btn-sm btn-danger action");
  canteenDeleteEl.setAttribute("id", "delete-button");
  canteenDeleteEl.setAttribute("data-value", item.id);
  canteenDeleteEl.textContent = "Delete";

  canteenConfigEl.appendChild(canteenDeleteEl);
  canteenRowEl.appendChild(canteenNameEl);
  canteenRowEl.appendChild(canteenPriceEl);
  canteenRowEl.appendChild(canteenConfigEl);
  canteenListingEl.appendChild(canteenRowEl);
};

// Event listeners
confirmCanteenEl.addEventListener("click", (event) => {
  event.preventDefault();
  addHandler("CANTEEN");
});

canteenListingEl.addEventListener("click", (event) => {
  if (event.target.id === "delete-button") {
    deleteHandler(event.target.getAttribute("data-value"), "CANTEEN");
  }
});

// Main
hideAdmin();
startLogin("CANTEEN");

// Testing
