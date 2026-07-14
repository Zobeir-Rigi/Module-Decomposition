if (!currentUser) {
  window.location.href = "index.html";
}

document.getElementById("welcome").textContent = `Welcome, ${currentUser}`;

const renderUsers = (users) => {
  const recipient = document.getElementById("recipient");

  const selectedUser = recipient.value;

  recipient.innerHTML = '<option value="">Select User</option>';

  users.forEach((user) => {
    if (user === currentUser) {
      return;
    }

    const option = document.createElement("option");

    option.value = user;
    option.textContent = user;

    recipient.appendChild(option);
  });

  if (users.includes(selectedUser)) {
    recipient.value = selectedUser;
  }
};

const fetchUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users`);

    const users = await response.json();

    renderUsers(users);
  } catch {
    showError("Failed to load users");
  }
};

const sendPrivateMessage = async () => {
  document.getElementById("error").textContent = "";

  const recipient = document.getElementById("recipient").value;

  const message = document.getElementById("msg").value.trim();

  if (!recipient) {
    showError("Select a recipient");
    return;
  }

  if (!message) {
    showError("Message is required");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/private-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: currentUser,
        to: recipient,
        message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      showError(data.error);
      return;
    }

    document.getElementById("msg").value = "";

    fetchPrivateMessages(recipient);
  } catch {
    showError("Failed to send private message");
  }
};

const fetchPrivateMessages = async (recipient) => {
  try {
    const response = await fetch(
      `${BASE_URL}/private-messages?user1=${currentUser}&user2=${recipient}`,
    );

    const messages = await response.json();

    const messagesContainer = document.getElementById("messages");

    messagesContainer.innerHTML = "";

    messages.forEach((message) => {
      renderPrivateMessage(message);
    });
  } catch {
    showError("Failed to load messages");
  }
};

const renderPrivateMessage = (message) => {
  const messagesContainer = document.getElementById("messages");

  const card = document.createElement("div");

  card.classList.add("message-card");

  const sender = document.createElement("strong");

  sender.textContent = message.from;

  const text = document.createElement("p");

  text.textContent = message.message;

  const timestamp = document.createElement("small");

  timestamp.textContent = formatTime(message.timestamp);

  card.appendChild(sender);
  card.appendChild(text);
  card.appendChild(timestamp);

  messagesContainer.appendChild(card);
};

window.fetchPrivateMessages = fetchPrivateMessages;

window.renderUsers = renderUsers;

const init = () => {
  fetchUsers();

  setupSendButton(sendPrivateMessage);
  setupEnterToSend("msg", sendPrivateMessage);

  document.getElementById("logout-button").addEventListener("click", logout);

  document
    .getElementById("public-chat-button")
    .addEventListener("click", () => {
      window.location.href = "chat.html";
    });

  document.getElementById("recipient").addEventListener("change", (e) => {
    fetchPrivateMessages(e.target.value);
  });
};

init();
