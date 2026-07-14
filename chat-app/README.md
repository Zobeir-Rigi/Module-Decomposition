# Chat App

A real-time chat application built with **JavaScript**, **Node.js**, **Express**, and **WebSockets**.

Users can communicate in a public chat room, send private messages, edit and delete their messages, react with likes, and receive real-time updates.

---
## Live Demo

🔗 Frontend

https://zobeir-rigi-chat-app.hosting.codeyourfuture.io/

🔗 Backend API

https://pp3psp4mxrlip4uxvmeb9cmv.hosting.codeyourfuture.io

## Features

### Public Chat

- Send messages
- Edit your own messages
- Delete your own messages
- Like and unlike messages
- Clear chat history
- Real-time updates using WebSockets

### Private Chat

- View online users
- Select a user from a dropdown
- Send private messages
- Receive private messages in real time
- View private conversation history

### User Experience

- Enter key to send messages
- Send button with icon
- Responsive chat layout
- User-friendly error handling
- Logout functionality

---

## Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript (Vanilla JS)

### Backend

- Node.js
- Express.js
- WebSocket (ws)
- CORS

---

## Project Structure

```text
chat-app/
│
├── README.md
│
├── backend/
│   ├── app.js
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── index.html
│   ├── chat.html
│   ├── private-chat.html
│   ├── style.css
│   ├── index.css
│   ├── chat.js
│   ├── private-chat.js
│   ├── api.js
│   ├── websocket.js
│   ├── render.js
│   ├── chat-utils.js
│   └── icons/
│
└── .gitignore
```

---

## Installation

### Clone the repository

```bash
git clone https://github.com/Zobeir-Rigi/Module-Decomposition/tree/chat-app
cd chat-app
```

### Install dependencies

```bash
cd backend
npm install
```

### Start the server

```bash
node app.js
```

The application will run on:

```text
http://localhost:3000
```

---

## API Endpoints

### Public Messages

#### Get all messages

```http
GET /messages
```

#### Create a message

```http
POST /messages
```

#### Edit a message

```http
PUT /messages/:id
```

#### Delete a message

```http
DELETE /messages/:id
```

#### Like a message

```http
POST /messages/:id/like
```

---

### Users

#### Get connected users

```http
GET /users
```

---

### Private Messages

#### Send a private message

```http
POST /private-message
```

#### Get conversation history

```http
GET /private-messages?user1=Ali&user2=Bob
```

---

## WebSocket Events

### Client → Server

#### Register User

```json
{
  "type": "REGISTER",
  "username": "Ali"
}
```

### Server → Client

- `NEW_MESSAGE`
- `EDIT_MESSAGE`
- `DELETE_MESSAGE`
- `LIKE_MESSAGE`
- `PRIVATE_MESSAGE`
- `USERS_UPDATED`

---

## Future Improvements

- Authentication and user accounts
- Database integration
- Typing indicators
- Online/offline status indicators
- Unread private message notifications
- Mobile-first responsive design
- Message search functionality
- File and image sharing

---

## Learning Outcomes

This project demonstrates:

- REST API development with Express
- Real-time communication using WebSockets
- Frontend and backend integration
- CRUD operations
- DOM manipulation
- Event-driven programming
- State management
- Private messaging systems

---

## Author

**Zobeir RIGI**

Software Developer

Built as a learning project to practice JavaScript, Node.js, Express, REST APIs, and WebSocket-based real-time communication.
