import express from "express"
const app = express()

// Express provides a helper method for reading headers:
const usernameMiddleware = (req, res, next) => {

    const username = req.get("X-Username");
    if (username) {
        req.username = username;
    } else {
        req.username = null;
    }
    next();
}

app.use(usernameMiddleware)

app.post("/", (req, res) => {
    res.send(`username: ${req.username}`)
})

// app.get("/", (req, res) => {
//     let respondText = `Hello world!<br>`
//     respondText += `<small>Requested at : ${req.requestTime}</small>`
//     res.send(respondText )

// })

app.listen(3000, () => {
    console.log("The server running on 3000 port")
})

