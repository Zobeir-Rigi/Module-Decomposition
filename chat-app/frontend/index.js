const fetchMessages = async () => {
    const url = "http://localhost:3000/messages"

    try {
        const response = await fetch(url);
        const data = await response.json()
        console.log(data)

        const messages = document.getElementById("messages")
        messages.innerHTML = ""; // avoid duplicatin when u need to call func again

        data.forEach((e) => {
            const div = document.createElement("div")

            const userName = document.createElement("strong")
            userName.textContent = e.name
            div.appendChild(userName)

            const message = document.createElement("p")
            message.textContent = e.message
            div.appendChild(message)

            const timestamp = document.createElement("small")
            timestamp.textContent = e.timestamp
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
    const name = document.getElementById("user").value
    const msg = document.getElementById("msg").value
    const url = "http://localhost:3000/message"

    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            message: msg
        })
    })

    // fetchMessages() instead webSocket 
    document.getElementById("user").value = ""
    document.getElementById("msg").value = ""
}


const ws = new WebSocket("ws://localhost:3000");

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(data);

    const messages = document.getElementById("messages");

    const div = document.createElement("div");

    const nameEl = document.createElement("strong");
    nameEl.textContent = data.name;

    const messageEl = document.createElement("p");
    messageEl.textContent = data.message;

    const timeEl = document.createElement("small");
    timeEl.textContent = data.timestamp;

    div.appendChild(nameEl);
    div.appendChild(messageEl);
    div.appendChild(timeEl);

    messages.appendChild(div);
};