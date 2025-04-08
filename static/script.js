const socket = io();
let username = "";
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

// Toggle file input visibility
function toggleFileInput() {
    const fileInput = document.getElementById("fileInput");
    fileInput.click();
}

// Handle incoming message
socket.on("message", function(message){
    const li = document.createElement("li");
    const sender = message.split(":")[0];

    if (sender === username) {
        li.classList.add("my-message");
    } else {
        li.classList.add("other-message");
    }

    // Handle media content
    if (message.includes("data:")) {
        const type = message.split(";")[0].split(":")[1]; // image, video, audio
        let mediaTag;
        
        if (type.includes("image")) {
            mediaTag = `<img src="${message}" />`;
        } else if (type.includes("audio")) {
            mediaTag = `<audio controls><source src="${message}" /></audio>`;
        } else if (type.includes("video")) {
            mediaTag = `<video controls><source src="${message}" /></video>`;
        }
        
        li.innerHTML = mediaTag;
    } else {
        li.textContent = message;
    }

    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight;
});

// Send message to server
function sendMessage() {
    const message = input.value.trim();

    if (message) {
        // Send text message
        socket.emit("message", { name: username, text: message });
        input.value = "";
    } else {
        // Send file if available
        const fileInput = document.getElementById("fileInput");
        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const fileData = event.target.result; // Base64 data URL
                const fileType = file.type;

                // Emit file data to the server
                socket.emit("file", { name: username, fileData, fileType });
                fileInput.value = "";  // Reset the file input after sending
            };
            reader.readAsDataURL(file); // Convert file to base64
        }
    }
}
