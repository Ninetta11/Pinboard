let yearGroups = [];
const apiKey = "hoTgr9OUIYENlkzXxrIn3Mnx0mFUbggkcMprba6L";
const apiSuffix = `?auth=${apiKey}`;
const apiUrlPrefix = "https://pinboard-5f12a.firebaseio.com/";
const dropDownMenuEl = document.querySelector(".dropdown-menu");
const fetchYearGroups = () => {
  const queryUrl = apiUrlPrefix + "classes.json" + apiSuffix;
  fetch(queryUrl)
    .then((res) => res.json())
    .then((data) => {
      for (let key in data) {
        yearGroups.push({
          ...data[key],
          id: key,
        });
      }
      renderYearGroups(yearGroups);
    });
};
const createYearGroupDropDownItem = (yearGroup, index) => {
  console.log(yearGroup.name);
  const dropdownItemEl = document.createElement("a");
  dropdownItemEl.setAttribute("class", "dropdown-item");
  dropdownItemEl.setAttribute("data-value", yearGroup.id);
  console.log(yearGroup.id);
  dropdownItemEl.setAttribute("href", "#");
  dropdownItemEl.textContent = yearGroup.name;
  dropDownMenuEl.appendChild(dropdownItemEl);
};
const renderYearGroups = (yearGroups) => {
  yearGroups.forEach((yearGroup, index) => {
    createYearGroupDropDownItem(yearGroup, index);
  });
};
fetchYearGroups();

// store data-value in local storage
function storeDataValue() {
  localStorage.setItem("defaultYearGroup", JSON.stringify(yearGroups));
}

var storedData = JSON.parse(localStorage.getItem)("yearGroup");
console.log(storedData);

// key defaultYearGroup

// Dropdown menu takes you to the relevant page when you click

// Query Parameters
