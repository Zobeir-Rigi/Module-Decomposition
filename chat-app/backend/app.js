const WebSocket = require("ws");
const express = require("express");
const app = express();
app.use(express.json())

const allMessages = [
    {
        name: "Saeid",
        message: "Hi, How are you?"
    },
]

const fetchAllMessages = () => {
    return allMessages
}

app.get("/messages", (req, res) => {
    const messages = fetchAllMessages()
    res.json(messages)
})

const clients = [];
app.post("/message", (req, res) => {

    const {message, name} = req.body
    console.log(`Received message: ${name} ${message}`);
    allMessages.push({
         name,message
    })
    console.log(allMessages)

    clients.forEach(client =>{
        client.send(JSON.stringify({
            name,
            message
        }))
    })

    res.send({
        status: "success",
        message: message,
        name: name
    })

})

// app.listen("3000", () => {
//     console.log("server is running in this port")
// })
// Replace app.listen with http.createServer


//webSocket

// we need to create a server manually
const http = require("http");
const server = http.createServer(app);

server.listen("3000", () => {
    console.log("server is running in this port")
})
//Then create the WebSocket server:
const wss = new WebSocket.Server({ server });
/*✅ What this means
wss = your WebSocket server
It is connected to your HTTP server ✅
It’s now ready to accept connections ✅
*/
wss.on("connection", (ws) => {
    console.log("New client connected");
    clients.push(ws);

    ws.on("close", () => {
        console.log("Client disconnected");
        const index = clients.indexOf(ws);
        clients.splice(index, 1);
    });

});
//Each ws = one connected user
//You detect when a user connects ✅
//But you don’t remember them ❌



//✅ STEP 3 — Store connected clients
// const clients = [];

//✅ STEP 4 — Handle disconnections (VERY important)
/* ws.on("close", () => {
        console.log("Client disconnected");

        // remove this client from the array
        const index = clients.indexOf(ws);
        clients.splice(index, 1);
    });
✅ What this means (simple)

ws.on("close") → runs when user leaves
indexOf(ws) → find that user
splice(...) → remove them

✅ STEP 5 — Broadcast message to all clients
Right now:

You store messages ✅
You track connected users ✅
But you don’t send messages to them yet ❌
✅ Goal of this step
👉 When a new message is posted:

Send it to every connected client instantly
clients.forEach((client) => {
    client.send(JSON.stringify({
        name,
        message
    }));
});
``
JSON.stringify → convert object → text (required)
WebSockets only send strings, not objects


*/

