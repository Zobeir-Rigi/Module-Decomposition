if (!currentUser) {
  window.location.href = "index.html";
}
document.getElementById("welcome").textContent = `Welcome, ${currentUser}`;


const init = () => {
  fetchMessages();

  const sendButton = document.getElementById("send-button");
  const sendImg = document.createElement("img");
  sendImg.src = "./icons/send.svg";
  sendButton.appendChild(sendImg);
  sendButton.addEventListener("click", sendMessage);

  document
    .getElementById("clear-allMessages")
    .addEventListener("click", clearChat);

  document.getElementById("logout-button").addEventListener("click", logout);
};

init();
