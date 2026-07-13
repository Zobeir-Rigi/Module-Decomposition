if (!currentUser) {
  window.location.href = "index.html";
}

document.getElementById("welcome").textContent =
  `Welcome, ${currentUser}`;

const fetchUsers = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/users`
    );

    const users = await response.json();

    const recipient =
      document.getElementById("recipient");

    recipient.innerHTML =
      '<option value="">Select User</option>';

    users.forEach((user) => {
      if (user === currentUser) {
        return;
      }

      const option =
        document.createElement("option");

      option.value = user;
      option.textContent = user;

      recipient.appendChild(option);
    });
  } catch {
    showError("Failed to load users");
  }
};

const sendPrivateMessage = async () => {
  const recipient =
    document.getElementById("recipient").value;

  const message =
    document.getElementById("msg")
      .value
      .trim();

  if (!recipient) {
    showError("Select a recipient");
    return;
  }

  if (!message) {
    showError("Message is required");
    return;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/private-message`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          from: currentUser,
          to: recipient,
          message,
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      showError(data.error);
      return;
    }

    document.getElementById("msg").value =
      "";

  } catch {
    showError(
      "Failed to send private message"
    );
  }
};

const init = () => {
  fetchUsers();

  document
    .getElementById("send-button")
    .addEventListener(
      "click",
      sendPrivateMessage
    );

  document
    .getElementById("logout-button")
    .addEventListener(
      "click",
      logout
    );

  document
    .getElementById("public-chat-button")
    .addEventListener(
      "click",
      () => {
        window.location.href =
          "chat.html";
      }
    );
};

init();