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
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
db.sequelize.sync({force: true})

io.on("connection", function (socket) {

    socket.on("join", (data) => {
        let decoded = jwt_decode(data.userToken);
        console.log(decoded);
        Auction.findOne({
            where: {
                roomId: decoded.room
            }
        }).then(auction => {
            socket.emit("joined", {auction: auction});
        })

        Bid.findAll({
            where: {
                userUID: decoded.user
            }
        }).then(bids => {
            socket.emit("bids", {bids: bids});
        })
    })

    socket.on("bid", (data) => {
        let decoded = jwt_decode(data.userToken);
        Bid.create({
            userUID: decoded.uid,
            price: data.price
        }).then(bid => {
            io.emit("bids", {bid: bid});
        })
        console.log(decoded)
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
