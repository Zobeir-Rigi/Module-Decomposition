// const WebSocket = require("ws");
const express = require("express");
const cors = require('cors');
// const clients = [];

const app = express();
app.use(express.json())
app.use(cors());

const allMessages = []

const fetchAllMessages = () => {
    return allMessages
}

app.get("/messages", (req, res) => {
    const messages = fetchAllMessages()
    res.json(messages)
})

let messageId = 0
const createMessage = (name, message) => {
    return {
        id: messageId++,
        name,
        message,
        timestamp: new Date(),
        likes: 0,
        dislikes: 0
    }
}

app.post("/message", (req, res) => {
    const { name, message } = req.body || {};

    if (
        !message || !name ||
        typeof message !== "string" ||
        typeof name !== "string" ||
        !message.trim() ||
        !name.trim()
    ) {
        return res.status(400).json({
            error: "Name and message are required"
        })
    }
    const newMessage = createMessage(name, message)

    allMessages.push(newMessage)

    res.status(201).json(newMessage);
    // 201 Created : The request succeeded and a new resource was created.
})

app.delete("/messages", (req, res) => {
    allMessages.length = 0;

    res.status(200).json({
        success: true,
        message: "Chat cleared"
    });
});

app.delete("/messages/:id", (req, res) => {

    const id = Number(req.params.id)
    const message = findMessageById(id)

    if (!message) {
        return res.status(404).json({
            error: "Message not found"
        })
    }

    const messageIndex = allMessages.findIndex(
        message => message.id === id
    );

    const deleteMessage = allMessages.splice(messageIndex, 1)[0];
    res.status(200).json(deleteMessage)
})

app.listen(3000, () => {
    console.log("server is running")
})

const findMessageById = (id) => {
    return allMessages.find(message => message.id === id)
}

//webSocket

// const http = require("http");
// const server = http.createServer(app);

// const PORT = process.env.PORT || 3000;

// server.listen(PORT, () => {
//     console.log("server is running");
// });


// const wss = new WebSocket.Server({ server });

// wss.on("connection", (ws) => {
//     console.log("New client connected");
//     clients.push(ws);

//     ws.on("close", () => {
//         console.log("Client disconnected");
//         const index = clients.indexOf(ws);
//         clients.splice(index, 1);
//     });

// });

