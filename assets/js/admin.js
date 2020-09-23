// Globals
let yearGroups = [];
const apiKey = "hoTgr9OUIYENlkzXxrIn3Mnx0mFUbggkcMprba6L";
const apiSuffix = `?auth=${apiKey}`;
const apiUrlPrefix = "https://pinboard-5f12a.firebaseio.com/";

// Elements
const yearGroupNameEl = document.getElementById("yearGroupName");
const confirmYearGroupEl = document.getElementById("confirmYearGroup");
const yearGroupListingEl = document.querySelector(".yearGroup-listing");
const alertContainerEl = document.querySelector(".alert-container");
const modalEl = document.querySelector(".modal");

// Functions
const clearYearGroupResults = () => {
  yearGroups = [];
  yearGroupListingEl.innerHTML = "";
  yearGroupNameEl.value = "";
};

const clearAlert = () => {
  alertContainerEl.innerHTML = "";
};

const closeModal = () => {
  document.querySelector(".modal-backdrop").remove();
  modalEl.classList.remove("show");
};

const alertHandler = (message, status) => {
  const alertEl = document.createElement("div");
  alertEl.setAttribute("role", "alert");
  switch (status) {
    case "ERROR":
      alertEl.setAttribute("class", "alert alert-danger");
      alertEl.textContent = `An error occured with status: ${message}`;
      break;
    case "SUCCESS":
      alertEl.setAttribute("class", "alert alert-success");
      alertEl.textContent = `Operation success with status: ${message}`;
      break;
    default:
      alertEl.setAttribute("class", "alert alert-primary");
      alertEl.textContent = message;
  }
  alertContainerEl.appendChild(alertEl);
};

const refreshAdmin = () => {
  clearYearGroupResults();
  fetchYearGroups();
};

const addYearGroupHandler = () => {
  const yearGroup = {
    name: yearGroupNameEl.value,
  };
  const queryUrl = apiUrlPrefix + "classes.json" + apiSuffix;
  fetch(queryUrl, {
    method: "POST",
    body: JSON.stringify(yearGroup),
  }).then((res) => {
    alertHandler(res.statusText, "SUCCESS");
    closeModal();
    refreshAdmin();
  });
};

// Delete year group
const deleteYearGroupHandler = (id) => {
  const queryUrl = apiUrlPrefix + `classes/${id}.json` + apiSuffix;
  fetch(queryUrl, {
    method: "DELETE",
  }).then((res) => {
    alertHandler(res.statusText, "SUCCESS");
    refreshAdmin();
  });
};

// Fetch year groups
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

// Output year groups
const createYearGroupRow = (yearGroup) => {
  const yearGroupListingEl = document.getElementById("yearGroup-listing");
  const yearGroupRow = document.createElement("tr");
  const yearGroupName = document.createElement("td");
  yearGroupName.setAttribute("scope", "row");
  yearGroupName.textContent = yearGroup.name;
  const yearGroupConfig = document.createElement("td");
  yearGroupConfig.setAttribute("scope", "row");

  const yearGroupDelete = document.createElement("button");
  yearGroupDelete.setAttribute("class", "btn btn-sm btn-danger action");
  yearGroupDelete.setAttribute("data-value", yearGroup.id);
  yearGroupDelete.textContent = "Delete";

  yearGroupConfig.appendChild(yearGroupDelete);
  yearGroupRow.appendChild(yearGroupName);
  yearGroupRow.appendChild(yearGroupConfig);
  yearGroupListingEl.appendChild(yearGroupRow);
};

// Render year groups
const renderYearGroups = (yearGroups) => {
  yearGroups.forEach((yearGroup, index) => {
    createYearGroupRow(yearGroup, index);
  });
};

// Event listeners
confirmYearGroupEl.addEventListener("click", (event) => {
  event.preventDefault();
  addYearGroupHandler();
});

yearGroupListingEl.addEventListener("click", (event) => {
  if (event.target.getAttribute("data-value")) {
    deleteYearGroupHandler(event.target.getAttribute("data-value"));
  }
});

alertContainerEl.addEventListener("click", () => {
  clearAlert();
});

// Main Program
fetchYearGroups();
