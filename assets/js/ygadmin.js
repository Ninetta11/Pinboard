// Globals
let yearGroups = [];

// Elements
const yearGroupNameEl = document.getElementById("yearGroupName");
const confirmYearGroupEl = document.getElementById("confirmYearGroup");
const yearGroupListingEl = document.querySelector(".yearGroup-listing");
const bookNameEl = document.getElementById("bookName");
const bookAuthorEl = document.getElementById("bookAuthor");
const confirmBookEl = document.getElementById("confirmBook");
const timetableFormEl = document.querySelector(".timetable-form");
const confirmTimetableEl = document.getElementById("confirmTimetable");

// Functions
const clearYearGroupResults = () => {
  yearGroups = [];
  yearGroupListingEl.innerHTML = "";
  yearGroupNameEl.value = "";
};

const clearTimetable = () => {
  timetableFormEl.innerHTML = "";
};

const clearBook = () => {
  bookNameEl.value = "";
  bookAuthorEl.value = "";
};

const refreshAdmin = (type) => {
  clearYearGroupResults();
  fetchData("YEAR_GROUP");
};

// Output year groups
const createYearGroupRow = (yearGroup) => {
  const yearGroupRow = document.createElement("tr");
  const yearGroupName = document.createElement("td");
  const yearGroupBook = document.createElement("td");
  yearGroupName.setAttribute("scope", "row");
  yearGroupName.textContent = yearGroup.name;
  yearGroupBook.setAttribute("scope", "row");
  yearGroupBook.textContent = yearGroup.book.name;
  const yearGroupConfig = document.createElement("td");
  yearGroupConfig.setAttribute("scope", "row");

  const yearGroupDelete = document.createElement("button");
  yearGroupDelete.setAttribute("class", "btn btn-sm btn-danger action");
  yearGroupDelete.setAttribute("id", "delete-button");
  yearGroupDelete.setAttribute("data-value", yearGroup.id);
  yearGroupDelete.textContent = "Delete";

  const manageTimetable = document.createElement("button");
  manageTimetable.setAttribute("class", "btn btn-sm btn-primary mr-1 action");
  manageTimetable.setAttribute("data-value", yearGroup.id);
  manageTimetable.setAttribute("id", "manageTimetable-button");
  manageTimetable.setAttribute("data-toggle", "modal");
  manageTimetable.setAttribute("data-target", "#timetableModal");
  manageTimetable.textContent = "Manage Timetable";

  const manageBook = document.createElement("button");
  manageBook.setAttribute("class", "btn btn-sm btn-primary mr-1 action");
  manageBook.setAttribute("data-value", yearGroup.id);
  manageBook.setAttribute("id", "manageBook-button");
  manageBook.setAttribute("data-toggle", "modal");
  manageBook.setAttribute("data-target", "#bookModal");
  manageBook.textContent = "Manage Term Book";

  yearGroupConfig.appendChild(manageTimetable);
  yearGroupConfig.appendChild(manageBook);
  yearGroupConfig.appendChild(yearGroupDelete);
  yearGroupRow.appendChild(yearGroupName);
  yearGroupRow.appendChild(yearGroupBook);
  yearGroupRow.appendChild(yearGroupConfig);
  yearGroupListingEl.appendChild(yearGroupRow);
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

const getBookById = (id) => {
  const yearGroup = yearGroups.find((element) => element.id === id);
  if (yearGroup.book) {
    return yearGroup.book;
  } else {
    return "unassigned";
  }
};

// Manage book handler
const manageBookHandler = (id) => {
  const book = getBookById(id);
  clearBook();
  bookNameEl.value = book.name;
  bookAuthorEl.value = book.author;
  confirmBookEl.setAttribute("data-value", id);
};

const saveBookHandler = (id) => {
  showSpinner();
  const updatedBook = {
    book: {
      name: bookNameEl.value,
      author: bookAuthorEl.value,
    },
  };

  const queryUrl = apiUrlPrefix + "classes/" + `${id}.json` + apiSuffix;
  fetch(queryUrl, {
    method: "PATCH",
    body: JSON.stringify(updatedBook),
  }).then((res) => {
    alertHandler(res.statusText, "SUCCESS");
    closeModal();
    refreshAdmin();
    clearSpinner();
  });
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
  showSpinner();
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
    clearSpinner();
  });
};

// Event listeners
confirmTimetableEl.addEventListener("click", (event) => {
  event.preventDefault();
  saveTimetableHandler(event.target.getAttribute("data-value"));
});

confirmBookEl.addEventListener("click", (event) => {
  event.preventDefault();
  saveBookHandler(event.target.getAttribute("data-value"));
});

confirmYearGroupEl.addEventListener("click", (event) => {
  event.preventDefault();
  addHandler("YEAR_GROUP");
});

yearGroupListingEl.addEventListener("click", (event) => {
  switch (event.target.id) {
    case "manageBook-button":
      manageBookHandler(event.target.getAttribute("data-value"));
      break;
    case "manageTimetable-button":
      manageTimetableHandler(event.target.getAttribute("data-value"));
      break;
    case "delete-button":
      deleteHandler(event.target.getAttribute("data-value"), "YEAR_GROUP");
      break;
  }
});
// Main program
hideAdmin();
startLogin("YEAR_GROUP");

// Testing
