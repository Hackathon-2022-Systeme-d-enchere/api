var cors = require("cors");
const express = require("express");
const db = require("./models");
const app = express();
const bcrypt = require("bcryptjs");
app.use(cors());
const {Auction, User, Bid, Product} = require("./models/index");
const {createJWT} = require("./lib/security");
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

app.post('/register', async (req, res) => {
    const {username, role, password} = req.body;
    const foundUser = await User.findOne({
        where: {
            "username": username,
        }
    });

    if (!foundUser) {
        const user = new User({
            "username": username,
            "role": role,
            "password": password
        });

        user.save();
        res.status(201).json('User created');
    } else {
        res.status(409).json({message: "User already exists!"});
    }
});

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const foundUser = await User.findOne({
        where: {
            "username": username,
        }
    });

    if (!foundUser || !bcrypt.compareSync(password, foundUser.password)) {
        return res.status(400).json({'message': 'Information invalides'});
    } else {
        createJWT({id: foundUser.username, roles: [foundUser.role]})
            .then((token) =>
                res.json({token: token})
            );
    }
})


io.on("connection", function (socket) {

    const roomId = socket.handshake.query.id;

    socket.join(roomId);

    socket.on("join", (data) => {
        let decoded = jwt_decode(data.userToken);
        Auction.findOne({
            where: {
                roomId: decoded.room
            }
        }).then(auction => {
            io.to(roomId).emit("joined", {auction: auction});

            Product.findAll(
                {
                    where: {
                        AuctionId: auction.id,
                        isSold: false
                    }
                }
            ).then(productsForSale => {
                io.to(roomId).emit("products-for-sale", {products: productsForSale});
            })

            Product.findAll(
                {
                    where: {
                        AuctionId: auction.id,
                        isSold: true
                    }
                }
            ).then(productsSold => {
                io.to(roomId).emit("products-sold", {products: productsSold});
            })

            Product.findOne({
                where: {
                    AuctionId: auction.id,
                    isSold: false
                },
                include: [{
                    model: Bid
                }],
                order: [
                    [Bid, "price", "DESC"]
                ]
            }).then(product => {
                io.to(roomId).emit("active-product", {product: product});
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
        }).then(() => {
            Product.findByPk(data.productId).then(product => {
                Bid.create({
                    userUID: decoded.user,
                    price: data.bid,
                    ProductId: product.id
                }).then(() => {
                    Product.findOne({
                        where: {
                            id: product.id
                        },
                        include: [{
                            model: Bid
                        }],
                        order: [
                            [Bid, "price", "DESC"]
                        ]
                    }).then(product => {
                        io.to(roomId).emit("active-product", {product: product});
                    })
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
