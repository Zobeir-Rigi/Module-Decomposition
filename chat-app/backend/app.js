const express = require("express");
const cors = require('cors');
const clients = [];

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

let messageId = 1
const createMessage = (name, message) => {
    return {
        id: messageId++,
        name,
        message,
        timestamp: new Date(),
        likes: []
    }
}

app.post("/messages", (req, res) => {
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

    broadcast({
    type: "NEW_MESSAGE",
    message: newMessage
});

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
    const id = Number(req.params.id);

    const messageIndex = allMessages.findIndex(
        message => message.id === id
        
    );

    if (messageIndex === -1) {
        return res.status(404).json({
            error: "Message not found"
        });
    }

    const deletedMessage = allMessages.splice(messageIndex, 1)[0];

    broadcast({
    type: "DELETE_MESSAGE",
    messageId: deletedMessage.id
});

    res.status(200).json(deletedMessage);
});

app.put("/messages/:id", (req, res) => {
    const id = Number(req.params.id)
    const message = findMessageById(id)

    if (!message) {
        return res.status(404).json({
            error: "Message not found"
        })
    }
    const { message: updatedMessage } = req.body || {}

    if (
        typeof updatedMessage !== "string" ||
        !updatedMessage.trim()
    ) {
        return res.status(400).json({
            error: "Name and message are required"
        });
    }

    message.message = updatedMessage;
    res.status(200).json(message);

})

app.post("/messages/:id/like", (req, res) => {
    const id = Number(req.params.id);
    const { name } = req.body || {};

    if (
        typeof name !== "string" ||
        !name.trim()
    ) {
        return res.status(400).json({
            error: "Name is required"
        });
    }

    const message = findMessageById(id);

    if (!message) {
        return res.status(404).json({
            error: "Message not found"
        });
    }

    const hasLiked = message.likes.includes(name);

    if (hasLiked) {
        message.likes = message.likes.filter(
            user => user !== name
        );
    } else {
        message.likes.push(name);
    }

    res.status(200).json({
        ...message,
        likesCount: message.likes.length
    });
});
const findMessageById = (id) => {
   return allMessages.find(message => message.id === id)
}

// app.listen(3000, () => {
//    console.log("server is running")
// })

//webSocket
const WebSocket = require("ws");
const http = require("http");

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
    console.log("New client connected");

    clients.push(ws)

    broadcast({
        type: "TEST",
        message: "Hello from server"
    });
    

    ws.on("close", () => {
        console.log("Client disconnected");

        const index = clients.indexOf(ws);

        if (index !== -1) {
            clients.splice(index, 1);
        }
    });
});

const broadcast = (data) => {
    clients.forEach((client) => {
        client.send(JSON.stringify(data));
    });
};


server.listen(3000, () => {
    console.log("server is running");
});

