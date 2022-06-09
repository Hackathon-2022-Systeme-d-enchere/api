var cors = require("cors");
const express = require("express");
const db = require("./model");
const app = express();
app.use(cors());
const {Auction, Bid} = require("./model/index");
const jwt_decode = require("jwt-decode");

app.options('*', cors());

const PORT = process.env.PORT || 2000;

const bodyParser = require("body-parser");
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.set("port", PORT);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
db.sequelize.sync({ force: true })

io.on("connection", function (socket) {

  socket.on("join", (data) => {
    let decoded = jwt_decode(data.userToken);
    console.log(decoded)
    Bid.findAll({
        where: {
            userUID: decoded.uid
        }
    }).then(bids => {
        console.log(bids)
        socket.emit("joined", {bids: bids});
    })
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
