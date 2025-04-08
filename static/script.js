const socket = io();
let username = "";  // To store user name
const input = document.getElementById("messageInput");
const messages = document.getElementById("messages");

// Set username and show chat UI
function setUsername() {
    const inputField = document.getElementById("usernameInput");
    username = inputField.value.trim();
    if (!username) return;

    document.getElementById("usernameContainer").style.display = "none";
    document.getElementById("chatContainer").style.display = "block";
}

// Handle incoming message
socket.on("message", function(message){
    const li = document.createElement("li");

    const sender = message.split(":")[0];
    if (sender === username) {
        li.classList.add("message", "my-message");
    } else {
        li.classList.add("message", "other-message");
    }

    li.textContent = message;
    messages.appendChild(li);
});

// Send message to server
function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    // Send an object with name and text
    socket.emit("message", { name: username, text: message });
    input.value = "";
}
