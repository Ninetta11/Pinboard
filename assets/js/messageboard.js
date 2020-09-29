// Globals
const post = {
  messageText: "",
  charCount: 0,
};
const messages = [];

const apiKey = "hoTgr9OUIYENlkzXxrIn3Mnx0mFUbggkcMprba6L";
const apiSuffix = `?auth=${apiKey}`;
const apiUrlPrefix = "https://pinboard-5f12a.firebaseio.com/";
let currentYearGroupId = "";

// Elements
const messageInputEl = document.getElementById("message-input");
const charCountEl = document.getElementById("char-count");
const wallContainerEl = document.querySelector(".wall-container");
const postButtonEl = document.getElementById("post-button");

// Functions
const clearMessages = () => {
  messages.splice(0, messages.length);
};

const clearMessageInput = () => {
  messageInputEl.value = "";
  charCountEl.textContent = "";
};

const clearWall = () => {
  wallContainerEl.innerHTML = "";
};

const outputCharCount = () => {
  if (post.charCount > 255) {
    charCountEl.style.color = "red";
  } else {
    charCountEl.style.color = "green";
  }
  charCountEl.textContent = post.charCount;
};

const updatePostButton = () => {
  if (post.charCount === 0 || post.charCount > 255) {
    postButtonEl.setAttribute("disabled", "");
  } else {
    postButtonEl.removeAttribute("disabled");
  }
};

const messageInputHandler = (input) => {
  post.charCount = input.length;
  post.messageText = input;
  outputCharCount();
  updatePostButton();
};

const postMessageHandler = (id, message) => {
  const postData = {
    messageText: post.messageText,
  };
  const queryUrl = apiUrlPrefix + `classes/${id}/messages.json` + apiSuffix;
  fetch(queryUrl, {
    method: "POST",
    body: JSON.stringify(postData),
  }).then(() => {
    clearWall();
    clearMessageInput();
    fetchMessages();
  });
};

const renderMessages = () => {
  messages.forEach((message) => {
    const messageRowEl = document.createElement("div");
    messageRowEl.classList.add("row");
    messageRowEl.setAttribute("data-value", message.id);
    const cardEl = document.createElement("div");
    cardEl.classList.add("card", "message-body");
    const cardBodyEl = document.createElement("div");
    cardBodyEl.classList.add("card-body", "message-text");
    cardBodyEl.textContent = message.messageText;
    cardEl.appendChild(cardBodyEl);
    const deleteIconEl = document.createElement("i");
    deleteIconEl.classList.add("fas", "fa-trash");
    deleteIconEl.setAttribute("data-action", "DELETE");
    messageRowEl.appendChild(cardEl);
    messageRowEl.appendChild(deleteIconEl);
    wallContainerEl.prepend(messageRowEl);
  });
};

const fetchMessages = () => {
  const queryUrl =
    apiUrlPrefix + `classes/${currentYearGroupId}/messages.json` + apiSuffix;
  clearMessages();
  fetch(queryUrl)
    .then((res) => res.json())
    .then((data) => {
      for (let key in data) {
        messages.push({
          ...data[key],
          id: key,
        });
      }
      renderMessages();
    });
};

const deleteMesssageHandler = (id) => {
  const queryUrl =
    apiUrlPrefix +
    `classes/${currentYearGroupId}/messages/${id}.json` +
    apiSuffix;
  fetch(queryUrl, {
    method: "DELETE",
  }).then(() => {
    clearWall();
    fetchMessages();
  });
};

const getClassId = () => {
  let params = new URLSearchParams(document.location.search.substring(1));
  currentYearGroupId = params.get("yg");
};

// Event listners
messageInputEl.addEventListener("keyup", (event) => {
  messageInputHandler(event.target.value);
});

postButtonEl.addEventListener("click", (event) => {
  event.preventDefault();
  postMessageHandler(currentYearGroupId, post.messageText);
});

wallContainerEl.addEventListener("click", (event) => {
  switch (event.target.getAttribute("data-action")) {
    case "DELETE":
      deleteMesssageHandler(
        event.target.parentElement.getAttribute("data-value")
      );
      break;
  }
});

// Main program
getClassId();
fetchMessages();

// Testing
