const ws = new WebSocket(WS_URL);
ws.onopen = () => {
  console.log("WebSocket connected");
};

ws.onerror = (error) => {
  console.error("WebSocket error:", error);
};

ws.onclose = () => {
  console.log("WebSocket closed");
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  console.log("WS RECEIVED:", data);

  switch (data.type) {
    case "NEW_MESSAGE": {
      const empty = document.querySelector(".empty");

      if (empty) {
        empty.remove();
      }

      renderMessage(data.message);
      break;
    }
    case "TEST": {
      console.log(data.message);
      break;
    }
    case "DELETE_MESSAGE": {
      const messageCard = document.querySelector(
        `[data-id="${data.messageId}"]`,
      );

      if (messageCard) {
        messageCard.remove();
      }

      break;
    }

    case "EDIT_MESSAGE":
    case "LIKE_MESSAGE": {
      fetchMessages();
      break;
    }

    default:
      console.warn("Unknown websocket event:", data.type);
  }
};
