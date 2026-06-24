// const message = document.getElementById("")
// const userName = document.getElementById("username")

const fetchMessages = async () => {
    const url = "http://localhost:3000/messages"

    try {
        const response = await fetch(url);
        const data = await response.json()
        console.log(data)
    } catch {
        console.log("check the url")
    }

}
fetchMessages()