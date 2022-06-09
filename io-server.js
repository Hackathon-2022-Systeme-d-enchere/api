var cors = require("cors");
const express = require("express");
const db = require("./model");
const app = express();
app.use(cors());
const {Auction, Bid, Product} = require("./model/index");
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
db.sequelize.sync({force: false})

io.on("connection", function (socket) {

    socket.on("join", (data) => {
        let decoded = jwt_decode(data.userToken);
        console.log(decoded)
        Auction.findOne({
            where: {
                roomId: decoded.room
            }
        }).then(auction => {
            socket.emit("joined", {auction: auction});
            Bid.findAll({
                where: {
                    userUID: decoded.user
                }
            }).then(bids => {
                socket.emit("bids", {bids: bids});
            })
            Product.findAll(
                {
                    where: {
                        AuctionId: auction.id,
                        isSold: false
                    }
                }
            ).then(productsForSale => {
                socket.emit("products-for-sale", {products: productsForSale});
            })

            Product.findAll(
                {
                    where: {
                        AuctionId: auction.id,
                        isSold: true
                    }
                }
            ).then(productsSold => {
                socket.emit("products-sold", {products: productsSold});
            })

        }).catch(err => {
            console.log(err);
        })
    })

    socket.on("new-bid", (data) => {
        let decoded = jwt_decode(data.userToken);
        Auction.findOne({
            where: {
                roomId: decoded.room
            }
        }).then(auction => {
            Bid.create({
                userUID: decoded.user,
                price: 120,
                AuctionId: auction.id
            }).then(bid => {
                Bid.findAll({
                    where: {
                        userUID: decoded.user
                    }
                }).then(bids => {
                    console.log(bids)
                    socket.emit("bids", {bids: bids});
                })
            })
        })
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
