let yearGroups = [];
const apiKey = "hoTgr9OUIYENlkzXxrIn3Mnx0mFUbggkcMprba6L";
const apiSuffix = `?auth=${apiKey}`;
const apiUrlPrefix = "https://pinboard-5f12a.firebaseio.com/";
const dropDownMenuEl = document.querySelector(".dropdown-menu");
var href = "bulletin.html?yg=" + "yearGroup.id";

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
  dropdownItemEl.setAttribute("href", href);
  dropdownItemEl.textContent = yearGroup.name;
  dropDownMenuEl.appendChild(dropdownItemEl);
};
const renderYearGroups = (yearGroups) => {
  yearGroups.forEach((yearGroup, index) => {
    createYearGroupDropDownItem(yearGroup, index);
  });
};
fetchYearGroups();

// key defaultYearGroup
var defaultYearGroup = [];
// var defaultYearGroup = yearGroup.name, yearGroup.id

// function collectIDs() {ls
//   for (var i = 0; i < yearGroup.length; i++) {
//     var yearGroup = yearGroup[i];

//     var li = document.createElement("li");
//     li.setAttribute("data-index", i);
//   }
// }
// store data-value in local storage
function storeDataValue() {
  localStorage.setItem("defaultYearGroup", JSON.stringify(yearGroups));
}

var storedData = JSON.parse(localStorage.getItem)("yearGroup");

if (storedData !== null) {
  defaultYearGroup = storedData;
}
