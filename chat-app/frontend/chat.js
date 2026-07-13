if (!currentUser) {
  window.location.href = "index.html";
}
document.getElementById("welcome").textContent = `Welcome, ${currentUser}`;

const renderMessage = (e) => {
  const messages = document.getElementById("messages");
  const messageCard = document.createElement("div");
  messageCard.classList.add("message-card");
  // Store the message id so we can find and remove it later.
  messageCard.dataset.id = e.id;

  const userName = document.createElement("strong");
  userName.textContent = e.name;

  const message = document.createElement("p");
  message.textContent = e.message;

  const timestamp = document.createElement("small");
  timestamp.textContent = formatTime(e.timestamp)

  const editBut = document.createElement("button");
  const editImg = document.createElement("img");
  editImg.src = "./icons/edit.svg";
  editBut.appendChild(editImg);
  editBut.addEventListener("click", () => editMessage(e));

  const deleteBut = document.createElement("button");
  deleteBut.classList.add("delete-btn");
  const deleteImg = document.createElement("img");
  deleteImg.src = "./icons/delete.svg";
  deleteBut.appendChild(deleteImg);
  deleteBut.addEventListener("click", () => deleteMessage(e.id));

  const likeBut = document.createElement("button");
  const likeImg = document.createElement("img");
  likeImg.src = "./icons/like.svg";
  likeImg.alt = "Like";
  likeBut.appendChild(likeImg);
  likeBut.append(` ${e.likes.length}`);
  likeBut.addEventListener("click", () => likeMessage(e.id));

  // const likesCount = document.createElement("small");
  // likesCount.textContent = e.likes.length;
  const actions = document.createElement("div");
  actions.classList.add("message-actions");

  if (e.name === currentUser) {
    actions.appendChild(editBut);
    actions.appendChild(deleteBut);
  }

  actions.appendChild(likeBut);
  // actions.appendChild(likesCount);

  messageCard.appendChild(userName);
  messageCard.appendChild(message);
  messageCard.appendChild(timestamp);
  messageCard.appendChild(actions);

  messages.appendChild(messageCard);
};

const renderEmptyState = () => {
  const messages = document.getElementById("messages");

  const noData = document.createElement("div");
  noData.textContent = "There are no chat yet ...";
  noData.classList.add("empty");

  messages.appendChild(noData);
};

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
