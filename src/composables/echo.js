import Echo from "laravel-echo";

window.io = require("socket.io-client");

const echo_instance = new Echo({
    broadcaster: "socket.io",
    host: process.env.VUE_APP_ECHO_SERVER,
    auth: {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    },
});

export default echo_instance;