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

            const userName = document.createElement("div")
            userName.textContent = e.name
            div.appendChild(userName)

            const message = document.createElement("p")
            message.textContent = e.message
            div.appendChild(message)

            const timestamp = document.createElement("span")
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
 // send a message 

 const sendMessage = async () => {
    const name = document.getElementById("user").value
    const msg = document.getElementById("msg").value
    const url = "http://localhost:3000/message"

     await fetch(url, {
        method: "POST",
        headers: {
                "Content-Type" : "application/json",
        },
        body: JSON.stringify({
            name,
            message : msg
        })
    })

    fetchMessages()
    document.getElementById("user").value = ""
    document.getElementById("msg").value = ""
 }

