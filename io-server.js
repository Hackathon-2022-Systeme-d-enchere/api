var cors = require("cors");
const express = require("express");

const app = express();
app.use(cors());

app.options('*', cors());

const PORT = process.env.PORT || 2000;

const bodyParser = require("body-parser");
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.set("port", PORT);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

io.on("connection", function (socket) {

  socket.on("join", (message) => {
    socket.emit("joined", message);
  })

  socket.on("bid", (message) => {
    console.log("bid", message);
  })

  socket.on("disconnect", onDisconnect);

  function onDisconnect() {
    console.log("Received: disconnect event from client: " + socket.id);
    socket.removeListener("disconnect", onDisconnect);
  }
});

http.listen(app.get("port"), function () {
    console.log("Server started on port " + app.get("port"));
});
