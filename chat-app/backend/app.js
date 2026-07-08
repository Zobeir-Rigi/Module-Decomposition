const WebSocket = require("ws");
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


app.post("/message", (req, res) => {

    const { message, name } = req.body || {};

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
    const timestamp = new Date();
    console.log(`Received message: ${name} ${message}`);
    allMessages.push({
        name, message, timestamp
    })

    clients.forEach(client => {
        client.send(JSON.stringify({
            name,
            message,
            timestamp
        }))
    })

    res.send({
        status: "success",
        message: message,
        name: name,
        timestamp: timestamp
    })

})

app.delete("/messages", (req, res) => {
    allMessages.length = 0;

    res.status(200).json({
        success: true,
        message: "Chat cleared"
    });
});

// app.listen(3000, ()=>{
//     console.log("server is running")
// })

//webSocket

const http = require("http");
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("server is running");
});


const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
    console.log("New client connected");
    clients.push(ws);

    ws.on("close", () => {
        console.log("Client disconnected");
        const index = clients.indexOf(ws);
        clients.splice(index, 1);
    });

});

