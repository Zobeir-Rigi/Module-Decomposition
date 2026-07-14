const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");

const app = express();

app.use(express.json());
app.use(cors());

const clients = [];
const connectedUsers = new Map();

const allMessages = [];
const privateMessages = [];

let messageId = 1;

const createMessage = (name, message) => {
  return {
    id: messageId++,
    name,
    message,
    timestamp: new Date(),
    likes: [],
  };
};

const findMessageById = (id) => {
  return allMessages.find((message) => message.id === id);
};

const broadcast = (data) => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

/* PUBLIC CHAT */

app.get("/messages", (req, res) => {
  res.json(allMessages);
});

app.post("/messages", (req, res) => {
  const { name, message } = req.body || {};

  if (
    !message ||
    !name ||
    typeof message !== "string" ||
    typeof name !== "string" ||
    !message.trim() ||
    !name.trim()
  ) {
    return res.status(400).json({
      error: "Name and message are required",
    });
  }

  const newMessage = createMessage(name, message);

  allMessages.push(newMessage);

  broadcast({
    type: "NEW_MESSAGE",
    message: newMessage,
  });

  res.status(201).json(newMessage);
});

app.delete("/messages", (req, res) => {
  allMessages.length = 0;

  res.status(200).json({
    success: true,
    message: "Chat cleared",
  });
});

app.delete("/messages/:id", (req, res) => {
  const id = Number(req.params.id);

  const { name } = req.body || {};

  const messageIndex = allMessages.findIndex((message) => message.id === id);

  if (messageIndex === -1) {
    return res.status(404).json({
      error: "Message not found",
    });
  }

  const message = allMessages[messageIndex];

  if (message.name !== name) {
    return res.status(403).json({
      error: "You can only delete your own messages",
    });
  }

  const deletedMessage = allMessages.splice(messageIndex, 1)[0];

  broadcast({
    type: "DELETE_MESSAGE",
    messageId: deletedMessage.id,
  });

  res.status(200).json(deletedMessage);
});

app.put("/messages/:id", (req, res) => {
  const id = Number(req.params.id);

  const message = findMessageById(id);

  if (!message) {
    return res.status(404).json({
      error: "Message not found",
    });
  }

  const { name, message: updatedMessage } = req.body || {};

  if (typeof updatedMessage !== "string" || !updatedMessage.trim()) {
    return res.status(400).json({
      error: "Message is required",
    });
  }

  if (message.name !== name) {
    return res.status(403).json({
      error: "You can only edit your own messages",
    });
  }

  message.message = updatedMessage;

  broadcast({
    type: "EDIT_MESSAGE",
    message,
  });

  res.status(200).json(message);
});

app.post("/messages/:id/like", (req, res) => {
  const id = Number(req.params.id);

  const { name } = req.body || {};

  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({
      error: "Name is required",
    });
  }

  const message = findMessageById(id);

  if (!message) {
    return res.status(404).json({
      error: "Message not found",
    });
  }

  const hasLiked = message.likes.includes(name);

  if (hasLiked) {
    message.likes = message.likes.filter((user) => user !== name);
  } else {
    message.likes.push(name);
  }

  broadcast({
    type: "LIKE_MESSAGE",
    message,
  });

  res.status(200).json({
    ...message,
    likesCount: message.likes.length,
  });
});

/* USERS */

app.get("/users", (req, res) => {
  res.json([...connectedUsers.keys()]);
});

/* PRIVATE CHAT */

app.post("/private-message", (req, res) => {
  const { from, to, message } = req.body || {};

  if (!from || !to || !message || !message.trim()) {
    return res.status(400).json({
      error: "From, to and message are required",
    });
  }

  const recipient = connectedUsers.get(to);

  if (!recipient) {
    return res.status(404).json({
      error: "User not online",
    });
  }

  privateMessages.push({
    from,
    to,
    message,
    timestamp: new Date(),
  });

  recipient.send(
    JSON.stringify({
      type: "PRIVATE_MESSAGE",
      from,
      message,
    }),
  );

  res.status(200).json({
    success: true,
  });
});

app.get("/private-messages", (req, res) => {
  const { user1, user2 } = req.query;

  const messages = privateMessages.filter(
    (msg) =>
      (msg.from === user1 && msg.to === user2) ||
      (msg.from === user2 && msg.to === user1),
  );

  res.json(messages);
});

/* WEBSOCKET */

const server = http.createServer(app);

const wss = new WebSocket.Server({
  server,
});

wss.on("connection", (ws) => {
  clients.push(ws);

  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());

    switch (data.type) {
      case "REGISTER": {
        ws.username = data.username;

        connectedUsers.set(data.username, ws);

        broadcast({
          type: "USERS_UPDATED",
          users: [...connectedUsers.keys()],
        });

        break;
      }

      default:
        console.warn("Unknown WS message:", data.type);
    }
  });

  ws.on("close", () => {
    if (ws.username) {
      connectedUsers.delete(ws.username);
    }

    broadcast({
      type: "USERS_UPDATED",
      users: [...connectedUsers.keys()],
    });

    const index = clients.indexOf(ws);

    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
