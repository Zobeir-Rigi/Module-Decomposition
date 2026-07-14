const currentUser = localStorage.getItem("username");

const showError = (msg) => {
    const errorEl = document.getElementById("error");
    errorEl.textContent = msg;
    errorEl.style.color = "red";
};

const formatTime = (timestamp) => 
    new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })


const logout = () => {
    localStorage.removeItem("username");

    window.location.href = "index.html";
}

const setupSendButton = (handler) => {
  const sendButton =
    document.getElementById("send-button");

  if (!sendButton) {
    return;
  }

  sendButton.innerHTML = "";

  const sendImg =
    document.createElement("img");

  sendImg.src = "./icons/send.svg";
  sendImg.alt = "Send";

  sendButton.appendChild(sendImg);

  sendButton.addEventListener(
    "click",
    handler
  );
};

const setupEnterToSend = (
  inputId,
  handler
) => {
  const input =
    document.getElementById(inputId);

  if (!input) {
    return;
  }

  input.addEventListener(
    "keydown",
    (e) => {
      if (
        e.key === "Enter" &&
        !e.shiftKey
      ) {
        e.preventDefault();
        handler();
      }
    }
  );
};