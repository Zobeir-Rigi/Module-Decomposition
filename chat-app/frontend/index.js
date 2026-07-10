// const BASE_URL = "https://pp3psp4mxrlip4uxvmeb9cmv.hosting.codeyourfuture.io"
// const WS_URL = "wss://pp3psp4mxrlip4uxvmeb9cmv.hosting.codeyourfuture.io"
const BASE_URL = "http://localhost:3000"
const WS_URL = "ws://localhost:3000";

const renderMessage = (e) => {
    const messages = document.getElementById("messages")
    console.log(e)
    const div = document.createElement("div")

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
    editBut.textContent = "Edit"
    editBut.addEventListener("click", () => {
    editMessage(e);
});

    div.appendChild(userName)
    div.appendChild(message)
    div.appendChild(timestamp)
    div.appendChild(editBut)

    messages.appendChild(div)
}

const renderEmptyState = () => {
    const messages = document.getElementById("messages");

    const noData = document.createElement("div");
    noData.textContent = "There are no chat yet ...";
    noData.classList.add("empty");

    messages.appendChild(noData);
}

const fetchMessages = async () => {
    // const url = `${BASE_URL}/messages`

    try {
        const response = await fetch("http://localhost:3000/messages");
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
    const name = document.getElementById("user").value.trim()
    const msg = document.getElementById("msg").value.trim()

    if (!name || !msg) {
        showError("Name and message are required");
        return;
    }

    // const url = `${BASE_URL}/message`
    


    try {
        const res = await fetch("http://localhost:3000/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                message: msg
            })
        })

        const data = await res.json();

        if (!res.ok) {
            showError(data.error);
            return;
        }
        document.getElementById("error").textContent = "";

        document.getElementById("user").value = ""
        document.getElementById("msg").value = ""

    } catch (err) {
        showError("Network error");
    }
}

const showError = (msg) => {
    const errorEl = document.getElementById("error");
    errorEl.textContent = msg;
    errorEl.style.color = "red";
};

const ws = new WebSocket(WS_URL);
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    const empty = document.querySelector(".empty");
    if (empty) {
        empty.remove();
    }
    renderMessage(data)
};

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

    } catch {
        showError(err.message || "Failed to clear chat");
    }
};

const clearChatBut = document.getElementById("clear-allMessages");
clearChatBut.addEventListener("click", clearChat);

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
                    message: updatedMessage
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            showError(data.error);
            return;
        }

        fetchMessages();

    } catch {
        showError("Failed to update message");
    }
};

const init = () => {
    fetchMessages();

    const button = document.getElementById("send-button");
    button.addEventListener("click", sendMessage);


        document
        .getElementById("clear-allMessages")
        .addEventListener("click", clearChat)

};

init();