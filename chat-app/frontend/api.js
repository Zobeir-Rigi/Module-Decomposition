// API
console.log("API LOADED");

app.get("/", (req, res) => {
  res.send("Chat App API is running");
});

const fetchMessages = async () => {
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

