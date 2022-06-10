var cors = require("cors");
const express = require("express");
const db = require("./models");
const app = express();
const path = require('path');
const fileUpload = require('express-fileupload');
const {Auction, User, Bid, Product} = require("./models/index");
const jwt_decode = require("jwt-decode");
const {body} = require('express-validator');
const productController = require('./controllers/product.controller');
const securityController = require('./controllers/security.controller');

const PORT = process.env.PORT || 2000;

const bodyParser = require("body-parser");
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.set("port", PORT);
app.options('*', cors());
app.use(cors());
// app.use(verifyAuthorization());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(fileUpload());
db.sequelize.sync({force: false})

// ----- Security
app.post('/register', securityController.register);
app.post('/login', securityController.login)
// ----- Product
app.post('/product', body('name').isString(), body('minPrice').isFloat(), body('isSold').isBoolean(), productController.create)
app.get('/product', productController.getAll)
// ----- Pages
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname + '/admin.html'));
})

// ----- Socket.IO
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
            Product.findAll({
                where: {
                    AuctionId: auction.id, isSold: false
                }
            }).then(productsForSale => {
                socket.emit("products-for-sale", {products: productsForSale});
            })

            Product.findAll({
                where: {
                    AuctionId: auction.id, isSold: true
                }
            }).then(productsSold => {
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
                userUID: decoded.user, price: 120, AuctionId: auction.id
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
