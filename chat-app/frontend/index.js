const fetchMessages = async () => {
    const url = "https://pp3psp4mxrlip4uxvmeb9cmv.hosting.codeyourfuture.io/messages"

    try {
        const response = await fetch(url);
        const data = await response.json()

        const messages = document.getElementById("messages")
        messages.innerHTML = "";

        if (data.length === 0) {
            const noData = document.createElement("div")
            noData.textContent = "There is no chat yet ..."
            noData.classList.add("empty")

            messages.appendChild(noData)
            return;
        }

        data.forEach((e) => {
            const div = document.createElement("div")

            const userName = document.createElement("strong")
            userName.textContent = e.name
            div.appendChild(userName)

            const message = document.createElement("p")
            message.textContent = e.message
            div.appendChild(message)

            const timestamp = document.createElement("small")
            timestamp.textContent = new Date(e.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });

            div.appendChild(timestamp)
            messages.appendChild(div)
        }
        )
    } catch {
        console.log("check the url")
    }
}

fetchMessages()

const sendMessage = async () => {
    const name = document.getElementById("user").value.trim()
    const msg = document.getElementById("msg").value.trim()

    const url = "https://pp3psp4mxrlip4uxvmeb9cmv.hosting.codeyourfuture.io/message"

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

const showError = (msg) => {
    const errorEl = document.getElementById("error");
    errorEl.textContent = msg;
    errorEl.style.color = "red";
};

const ws = new
WebSocket("wss://pp3psp4mxrlip4uxvmeb9cmv.hosting.codeyourfuture.io");
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    const messages = document.getElementById("messages");

    const empty = document.querySelector(".empty");
    if (empty) {
        empty.remove();
    }

    const div = document.createElement("div");

    const nameEl = document.createElement("strong");
    nameEl.textContent = data.name;

    const messageEl = document.createElement("p");
    messageEl.textContent = data.message;

    const timestamp = document.createElement("small");
    timestamp.textContent = new Date(data.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    div.appendChild(nameEl);
    div.appendChild(messageEl);
    div.appendChild(timestamp);

    messages.appendChild(div);
};