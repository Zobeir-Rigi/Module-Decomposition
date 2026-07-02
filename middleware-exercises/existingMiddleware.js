import express from "express";
const app = express();

const usernameMiddleware = (req, res, next) => {
    req.username = req.get("X-Username") || null;
    next();
};

const validateBodyMiddleware = (req, res, next) => {
    if (!Array.isArray(req.body)) {
        return res.status(400).send("Body must be a JSON array");
    }

    for (const item of req.body) {
        if (typeof item !== "string") {
            return res
                .status(400)
                .send("All array items must be strings");
        }
    }

    next();
};

app.use(express.json());
app.use(usernameMiddleware);
app.use(validateBodyMiddleware)

app.post("/", (req, res) => {
    let authenticationMessage;

    if (req.username) {
        authenticationMessage =
            `You are authenticated as ${req.username}.`;
    } else {
        authenticationMessage =
            "You are not authenticated.";
    }

    const subjects = req.body;
    const numberOfSubjects = subjects.length;

    let subjectsMessage = `You have requested information about ${numberOfSubjects} subject`;

    if (numberOfSubjects !== 1) {
        subjectsMessage += "s";
    }

    if (numberOfSubjects > 0) {
        subjectsMessage += `: ${subjects.join(", ")}`;
    }

    subjectsMessage += ".";

    res.send(
        `${authenticationMessage}\n\n${subjectsMessage}\n`
    );
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});


// curl -X POST --data '["Bees"]' -H "Content-Type: application/json" -H "X-Username: Ahmed" http://localhost:3000