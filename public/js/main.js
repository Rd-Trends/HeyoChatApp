const navbtn = document.querySelector(".navbtn");
const sideBar = document.querySelector(".chat-sidebar");
const closesideBar = document.querySelector(".close-sidebarbtn");
const chatFormInput = document.querySelector("#chat-message-input");
const chatMessageContainer = document.querySelector(".chat-messages");
const roomName = document.querySelector(".roomname");
const domUsers = document.querySelector("#users");
const chatInput = document.querySelector("#msg");

navbtn.addEventListener("click", () => {
  sideBar.classList.add("show-sidebar");
});

closesideBar.addEventListener("click", () => {
  sideBar.classList.remove("show-sidebar");
});

const socket = io();

//function to get username and room name from url query string
function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const result = regex.exec(url);
  if (!result) return null;
  if (!result[2]) return "";
  return decodeURIComponent(result[2].replace(/\+/g, ""));
}

//capitalize the first character of a string
const capitalizeFirstStringCharacter = (word) => {
  if (typeof word !== "string") return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
};
const userName = capitalizeFirstStringCharacter(getParameterByName("name"));
const room = capitalizeFirstStringCharacter(getParameterByName("room"));

//output room name function
function outPutRoomName(room) {
  roomName.textContent = room;
}

//output user function
function outPutUsers(users) {
  domUsers.innerHTML = `${users
    .map((user) => `<li>${user.username}</li>`)
    .join("")}`;
}

//join chatroom
socket.emit("joinRoom", { userName, room });

//get room users
socket.on("roomUsers", ({ room, users }) => {
  outPutRoomName(room);
  outPutUsers(users);
});

socket.on("message", (message) => {
  outPutMessage(message);
});
//message submit
chatFormInput.addEventListener("submit", (e) => {
  e.preventDefault();

  //get message from input
  const msg = chatInput.value;

  //emit message to server
  if (msg === "") {
    return;
  } else {
    socket.emit("chatMessage", msg);

    //clear input after sending message
    chatInput.value = "";
    chatInput.focus();
  }
});

//function to output message to dom
function outPutMessage(message) {
  const div = document.createElement("div");
  div.classList.add("chat-message");
  div.innerHTML = `<p class="meta">${message.userName}<span> - ${message.time}</span></p>
  <p class="message">
    ${message.text}
  </p>`;
  chatMessageContainer.appendChild(div);
  chatMessageContainer.scrollTop = chatMessageContainer.scrollHeight;
}
