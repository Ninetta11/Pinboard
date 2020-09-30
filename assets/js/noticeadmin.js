// Globals
let notices = [];

// Elements
const noticeTextEl = document.getElementById("noticeText");
const confirmNoticeEl = document.getElementById("confirmNotice");
const noticeListingEl = document.querySelector(".notice-listing");

// Functions
const clearNotices = () => {
  notices = [];
  noticeListingEl.innerHTML = "";
  noticeTextEl.value = "";
};

const refreshAdmin = () => {
  clearNotices();
  fetchData("NOTICE");
};

// Output notices
const createNoticeRow = (notice) => {
  const noticeRow = document.createElement("tr");
  const noticeName = document.createElement("td");
  noticeName.setAttribute("scope", "row");
  noticeName.textContent = notice.noticeContent;
  const noticeConfig = document.createElement("td");
  noticeConfig.setAttribute("scope", "row");

  const noticeDelete = document.createElement("button");
  noticeDelete.setAttribute("class", "btn btn-sm btn-danger action");
  noticeDelete.setAttribute("id", "delete-button");
  noticeDelete.setAttribute("data-value", notice.id);
  noticeDelete.textContent = "Delete";

  noticeConfig.appendChild(noticeDelete);
  noticeRow.appendChild(noticeName);
  noticeRow.appendChild(noticeConfig);
  noticeListingEl.appendChild(noticeRow);
};

// Event listeners
confirmNoticeEl.addEventListener("click", (event) => {
  event.preventDefault();
  addHandler("NOTICE");
});

noticeListingEl.addEventListener("click", (event) => {
  if (event.target.id === "delete-button") {
    deleteHandler(event.target.getAttribute("data-value"), "NOTICE");
  }
});

// Main
hideAdmin();
startLogin("NOTICE");

// Testing
