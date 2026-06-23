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

app.get("/message", (req, res) => {
    const messages = fetchAllMessages()
    res.json(messages)
})

app.post("/message", (req, res) => {

    const {message, name} = req.body
    console.log(`Received message: ${name} ${message}`);
    allMessages.push({
        name: name,
        message: message
    })
    console.log(allMessages)
    res.send({
        status: "success",
        message: message,
        name: name
    })

})

app.listen("3000", () => {
    console.log("server is running in this port")
})
