const BASE_URL = "https://pp3psp4mxrlip4uxvmeb9cmv.hosting.codeyourfuture.io"
const WS_URL = "wss://pp3psp4mxrlip4uxvmeb9cmv.hosting.codeyourfuture.io"
// const BASE_URL = "http://localhost:3000"
// const WS_URL = "ws://localhost:3000"

const currentUser = localStorage.getItem("username");

if (!currentUser) {
    window.location.href = "index.html";
}
document.getElementById("welcome").textContent =
    `Welcome, ${currentUser}`

const logout = () => {
    localStorage.removeItem("username");

    window.location.href = "index.html";
}

const renderMessage = (e) => {
    const messages = document.getElementById("messages")
    const messageCard = document.createElement("div");
    messageCard.classList.add("message-card");
    // How do we find the correct HTML element to remove?from the backend to the correct DOM element.
    messageCard.dataset.id = e.id;

    const userName = document.createElement("strong")
    userName.textContent = e.name

    const message = document.createElement("p")
    message.textContent = e.message

    const timestamp = document.createElement("small")
    timestamp.textContent = new Date(e.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
    //Because each message gets its own Edit button:
    const editBut = document.createElement("button")
    const editImg = document.createElement("img");
    editImg.src = "./icons/edit.svg"
    editBut.appendChild(editImg);
    editBut.addEventListener("click", () => editMessage(e))

    const deleteBut = document.createElement("button")
    deleteBut.classList.add("delete-btn");
    const deleteImg = document.createElement("img");
    deleteImg.src = "./icons/delete.svg"
    deleteBut.appendChild(deleteImg);
    deleteBut.addEventListener("click", () => deleteMessage(e.id))

    const likeBut = document.createElement("button")
    const likeImg = document.createElement("img");
    likeImg.src = "./icons/like.svg"
    likeImg.alt = "Like"
    likeBut.appendChild(likeImg);
    likeBut.append(` ${e.likes.length}`);
    likeBut.addEventListener("click", () => likeMessage(e.id))

    // const likesCount = document.createElement("small");
    // likesCount.textContent = e.likes.length;
    const actions = document.createElement("div");
    actions.classList.add("message-actions");

    if (e.name === currentUser) {
        actions.appendChild(editBut);
        actions.appendChild(deleteBut);
    }

    actions.appendChild(likeBut);
    // actions.appendChild(likesCount);

    messageCard.appendChild(userName);
    messageCard.appendChild(message);
    messageCard.appendChild(timestamp);
    messageCard.appendChild(actions);

    messages.appendChild(messageCard);
}

const renderEmptyState = () => {
    const messages = document.getElementById("messages");

    const noData = document.createElement("div");
    noData.textContent = "There are no chat yet ...";
    noData.classList.add("empty");

    messages.appendChild(noData);
}
// API
const fetchMessages = async () => {
    // const url = `${BASE_URL}/messages`

    try {
        const response = await fetch(`${BASE_URL}/messages`);
        const data = await response.json()

        const messages = document.getElementById("messages")
        messages.innerHTML = "";

        if (data.length === 0) {
            renderEmptyState()
            return;
        }
        data.forEach(renderMessage)
    } catch {
        showError("Failed to load messages");
    }
}

const sendMessage = async () => {
    const currentUser = localStorage.getItem("username");
    const msg = document.getElementById("msg").value.trim()

    if (!msg) {
        showError("Message are required");
        return;
    }

    // const url = `${BASE_URL}/message`

    try {
        const res = await fetch(`${BASE_URL}/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: currentUser,
                message: msg
            })
        })

        const data = await res.json();

        if (!res.ok) {
            showError(data.error);
            return;
        }
        document.getElementById("error").textContent = "";

        document.getElementById("msg").value = ""

    } catch (err) {
        showError("Network error");
    }
}

const clearChat = async () => {
    try {
        const response = await fetch(`${BASE_URL}/messages`, {
            method: "DELETE"
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
            throw new Error(data.message);
        }
        console.log(data);

        const messages = document.getElementById("messages");
        messages.innerHTML = "";

        renderEmptyState();

    } catch (err) {
        showError(err.message || "Failed to clear chat");
    }
};

const clearChatBut = document.getElementById("clear-allMessages");
clearChatBut.addEventListener("click", clearChat);

// const clearImg = document.createElement("img")
// clearImg.src = "./icons/clearTheChat.svg"
// clearChatBut.appendChild(clearImg)

const editMessage = async (messageData) => {
    const updatedMessage = prompt(
        "Edit your message",
        messageData.message
    );

    if (!updatedMessage) {
        return;
    }

    try {
        const response = await fetch(
            `${BASE_URL}/messages/${messageData.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: currentUser,
                    message: updatedMessage
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            showError(data.error);
            return;
        }

    } catch {
        showError("Failed to update message");
    }
};

const deleteMessage = async (id) => {
    try {
        const response = await fetch(
            `${BASE_URL}/messages/${id}`,
            {
                method: "DELETE", headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: currentUser

                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            showError(data.error);
            return;
        }

    } catch {
        showError("Failed to delete message");
    }
};

const likeMessage = async (id) => {
    const currentUser = localStorage.getItem("username");

    try {
        const response = await fetch(
            `${BASE_URL}/messages/${id}/like`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: currentUser
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            showError(data.error);
            return;
        }

    } catch {
        showError("Failed to like message");
    }
};

const showError = (msg) => {
    const errorEl = document.getElementById("error");
    errorEl.textContent = msg;
    errorEl.style.color = "red";
};

const ws = new WebSocket(WS_URL);
ws.onopen = () => {
    console.log("WebSocket connected");
};

ws.onerror = (error) => {
    console.error("WebSocket error:", error);
};

ws.onclose = () => {
    console.log("WebSocket closed");
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    console.log("WS RECEIVED:", data);

    switch (data.type) {

        case "NEW_MESSAGE": {
            const empty = document.querySelector(".empty");

            if (empty) {
                empty.remove();
            }

            renderMessage(data.message);
            break;
        }

        case "DELETE_MESSAGE": {
            const messageCard = document.querySelector(
                `[data-id="${data.messageId}"]`
            );

            if (messageCard) {
                messageCard.remove();
            }

            break;
        }

        case "EDIT_MESSAGE": {
            fetchMessages();
            break;
        }

        case "LIKE_MESSAGE": {
            fetchMessages();
            break;
        }

        default:
            console.warn(
                "Unknown websocket event:",
                data.type
            );
    }
};

const init = () => {
    fetchMessages();

    const sendButton = document.getElementById("send-button");
    const sendImg = document.createElement("img")
    sendImg.src = "./icons/send.svg"
    sendButton.appendChild(sendImg)
    sendButton.addEventListener("click", sendMessage);


    document
        .getElementById("clear-allMessages")
        .addEventListener("click", clearChat)

    document
        .getElementById("logout-button")
        .addEventListener("click", logout);

};

init();