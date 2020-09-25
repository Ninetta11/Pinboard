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
const modalEl = document.querySelectorAll(".modal");
const timetableFormEl = document.querySelector(".timetable-form");
const confirmTimetableEl = document.getElementById("confirmTimetable");

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
  modalEl.forEach((el) => {
    el.classList.remove("show");
  });
};

const clearTimetable = () => {
  timetableFormEl.innerHTML = "";
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
    timetable: [],
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
  yearGroupDelete.setAttribute("id", "deleteYearGroup-button");
  yearGroupDelete.setAttribute("data-value", yearGroup.id);
  yearGroupDelete.textContent = "Delete";

  const manageTimetable = document.createElement("button");
  manageTimetable.setAttribute("class", "btn btn-sm btn-primary mr-1 action");
  manageTimetable.setAttribute("data-value", yearGroup.id);
  manageTimetable.setAttribute("id", "manageTimetable-button");
  manageTimetable.setAttribute("data-toggle", "modal");
  manageTimetable.setAttribute("data-target", "#timetableModal");
  manageTimetable.textContent = "Manage Timetable";

  yearGroupConfig.appendChild(manageTimetable);
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

const getTimetableById = (id) => {
  const timetable = yearGroups.find((element) => element.id === id);
  if (timetable.timetable) {
    return timetable.timetable;
  } else {
    const tempTimetable = [];
    for (i = 0; i < 8; i++) {
      tempTimetable.push("Free Block");
    }
    return tempTimetable;
  }
};

// Manage timetable handler
const manageTimetableHandler = (id) => {
  const timetable = getTimetableById(id);
  clearTimetable();
  for (i = 0; i < 8; i++) {
    const timeValue = i + 9;
    const timeValueName = `time-${timeValue}`;
    const timeRowEl = document.createElement("div");
    timeRowEl.classList.add("row", "cq-row");
    const nameColEl = document.createElement("div");
    nameColEl.classList.add("col-md-6");
    const timeLabelEl = document.createElement("label");
    timeLabelEl.setAttribute("for", timeValueName);
    timeLabelEl.textContent = `${timeValue}:00`;
    const timeInputColEl = document.createElement("div");
    timeInputColEl.classList.add("col-md-6");
    const timeInputEl = document.createElement("input");
    timeInputEl.setAttribute("type", "text");
    timeInputEl.setAttribute("id", timeValueName);
    timeInputEl.classList.add("form-control");
    timetable[i]
      ? (timeInputEl.value = timetable[i])
      : (timeInputEl.value = "Free Block");

    timeInputColEl.appendChild(timeInputEl);
    nameColEl.appendChild(timeLabelEl);
    timeRowEl.appendChild(nameColEl);
    timeRowEl.appendChild(timeInputColEl);
    timetableFormEl.appendChild(timeRowEl);
  }
  confirmTimetableEl.setAttribute("data-value", id);
};

const saveTimetableHandler = (id) => {
  const updatedTimetable = {
    timetable: [],
  };
  const offset = 9;
  for (i = 0; i < 8; i++) {
    updatedTimetable.timetable.push(
      document.getElementById(`time-${i + offset}`).value
    );
  }

  const queryUrl = apiUrlPrefix + "classes/" + `${id}.json` + apiSuffix;
  fetch(queryUrl, {
    method: "PATCH",
    body: JSON.stringify(updatedTimetable),
  }).then((res) => {
    alertHandler(res.statusText, "SUCCESS");
    closeModal();
    refreshAdmin();
  });
};

// Event listeners
confirmTimetableEl.addEventListener("click", (event) => {
  event.preventDefault();
  saveTimetableHandler(event.target.getAttribute("data-value"));
});

confirmYearGroupEl.addEventListener("click", (event) => {
  event.preventDefault();
  addYearGroupHandler();
});

yearGroupListingEl.addEventListener("click", (event) => {
  switch (event.target.id) {
    case "manageTimetable-button":
      manageTimetableHandler(event.target.getAttribute("data-value"));
      break;
    case "deleteYearGroup-button":
      deleteYearGroupHandler(event.target.getAttribute("data-value"));
      break;
  }
  // if (event.target.getAttribute("data-value")) {
  //   console.log(event);
  //   //deleteYearGroupHandler(event.target.getAttribute("data-value"));
  // }
});

alertContainerEl.addEventListener("click", () => {
  clearAlert();
});

// Main Program
fetchYearGroups();

// Testing
