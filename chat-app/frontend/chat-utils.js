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