const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const BOTPRESS_URL = "https://webhook.botpress.cloud/51fed69d-2a9c-434e-b82f-db2671423b2b";

// Add an initial bot message
appendMessage("Hello! How can I assist you today?", false);

// Detect Enter key press to send message
userInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

// Function to send the user's message to the bot
async function sendMessage() {
    const message = userInput.value.trim();
    if (message === "") return;

    appendMessage(message, true);
    userInput.value = "";
    showTypingIndicator();

    try {
        const response = await fetch(BOTPRESS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: message }),
        });

        const data = await response.json();
        const botReply = data.text || "I'm sorry, I didn't understand that.";
        chatBox.removeChild(chatBox.lastChild); // Remove typing indicator
        appendMessage(botReply, false);
    } catch (error) {
        console.error("Error communicating with the bot:", error);
        chatBox.removeChild(chatBox.lastChild); // Remove typing indicator
        appendMessage("There was an error. Please try again later.", false);
    }
}

// Function to display messages
function appendMessage(message, isUser) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.classList.add(isUser ? "user-message" : "bot-message");
    messageElement.innerText = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to show a "typing" indicator
function showTypingIndicator() {
    const typingIndicator = document.createElement("div");
    typingIndicator.classList.add("typing-indicator");
    typingIndicator.innerText = "Bot is typing...";
    chatBox.appendChild(typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;
}
