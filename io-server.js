var cors = require("cors");
const express = require("express");
const db = require("./models");
const app = express();
const bcrypt = require("bcryptjs");
const path = require('path');
const fileUpload = require('express-fileupload');
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
app.use(fileUpload());
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

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname + '/admin.html'));
})

app.post('/auction', async (req, res) => {
    let fileUpload;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send('No files were uploaded.');
        return;
    }

    fileUpload = req.files.image;

    if (!['image/png', 'image/jpeg'].includes(fileUpload.mimetype)) {
        res.status(400).send('Invalid file extension.');
        return;
    }

    uploadPath = __dirname + '/uploads/' + fileUpload.name;

    fileUpload.mv(uploadPath, function (err) {
        if (err) {
            return res.status(500).send(err);
        }

        res.send('File uploaded to ' + uploadPath);
    });
})

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
