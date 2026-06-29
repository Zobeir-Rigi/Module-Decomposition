const BASE_URL = "https://pp3psp4mxrlip4uxvmeb9cmv.hosting.codeyourfuture.io"
const WS_URL = "wss://pp3psp4mxrlip4uxvmeb9cmv.hosting.codeyourfuture.io"

const renderMessage = (e) => {
    const messages = document.getElementById("messages")

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

    div.appendChild(userName)
    div.appendChild(message)
    div.appendChild(timestamp)

    messages.appendChild(div)

}
const renderEmptyState = () => {
    const messages = document.getElementById("messages");

    const noData = document.createElement("div");
    noData.textContent = "There is no chat yet ...";
    noData.classList.add("empty");

    messages.appendChild(noData);
}

const fetchMessages = async () => {
    const url = `${BASE_URL}/messages`

    try {
        const response = await fetch(url);
        const data = await response.json()

        const messages = document.getElementById("messages")
        messages.innerHTML = "";

        if (data.length === 0) {
            renderEmptyState()
            return;
        }
        data.forEach(renderMessage)
    } catch {
        console.log("check the url")
    }
}

fetchMessages()


const sendMessage = async () => {
    const name = document.getElementById("user").value.trim()
    const msg = document.getElementById("msg").value.trim()

    const url = `${BASE_URL}/message`

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            message: msg
        })
    })

    let data;
    try {
        data = await res.json();
    } catch {
        data = {};
    }
    if (!res.ok) {
        showError(data.error);
        return;
    }

    document.getElementById("error").textContent = "";

    // fetchMessages() instead webSocket 
    document.getElementById("user").value = ""
    document.getElementById("msg").value = ""
}
const button = document.getElementById("send-button");
button.addEventListener("click", sendMessage)

const showError = (msg) => {
    const errorEl = document.getElementById("error");
    errorEl.textContent = msg;
    errorEl.style.color = "red";
};

const ws = new
    WebSocket(WS_URL);
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    const empty = document.querySelector(".empty");
    if (empty) {
        empty.remove();
    }
    renderMessage(data)
};