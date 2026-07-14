if (!currentUser) {
  window.location.href = "index.html";
}
document.getElementById("welcome").textContent = `Welcome, ${currentUser}`;

document.getElementById("private-chat-button").addEventListener("click", () => {
  window.location.href = "private-chat.html";
});

const init = () => {
  fetchMessages();

  setupSendButton(sendMessage);
  setupEnterToSend("msg", sendMessage);

  document
    .getElementById("clear-allMessages")
    .addEventListener("click", clearChat);

  document.getElementById("logout-button").addEventListener("click", logout);
};

init();
