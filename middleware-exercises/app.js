import express from "express";

const app = express();

const usernameMiddleware = (req, res, next) => {
    const username = req.get("X-Username");

    if (username) {
        req.username = username;
    } else {
        req.username = null;
    }

    next();
};

const parseBodyMiddleware = (req, res, next) => {
    let requestBody = "";

    req.on("data", (chunk) => {
        requestBody += chunk;
    });

    req.on("end", () => {
        try {
            const parsedBody = JSON.parse(requestBody);

            if (!Array.isArray(parsedBody)) {
                return res.status(400).send("Body must be a JSON array");
            }

            for (const item of parsedBody) {
                if (typeof item !== "string") {
                    return res
                        .status(400)
                        .send("All array items must be strings");
                }
            }

            req.body = parsedBody;

            next();
        } catch {
            return res.status(400).send("Invalid JSON");
        }
    });
};

app.use(usernameMiddleware);
app.use(parseBodyMiddleware);

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