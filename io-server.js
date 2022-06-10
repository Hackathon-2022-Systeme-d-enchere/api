var cors = require("cors");
const express = require("express");
const db = require("./models");
const app = express();
const path = require("path");
const fileUpload = require("express-fileupload");
const { Auction, User, Bid, Product } = require("./models/index");
const jwt_decode = require("jwt-decode");
const { body } = require("express-validator");
const productController = require("./controllers/product.controller");
const auctionController = require("./controllers/auction.controller");
const securityController = require("./controllers/security.controller");

const PORT = process.env.PORT || 2000;

const bodyParser = require("body-parser");
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.set("port", PORT);
app.options("*", cors());
app.use(cors());
// app.use(verifyAuthorization());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
db.sequelize.sync({ force: true });

// ----- Security
app.post("/register", securityController.register);
app.post("/login", securityController.login);
// ----- Product
app.post(
  "/product",
  body("name").isString(),
  body("minPrice").isFloat(),
  body("isSold").isBoolean(),
  productController.create
);
app.get("/product", productController.getAll);
// ----- Auction
app.post(
  "/auction",
  body("name").isString(),
  body("startAt").isDate(),
  body("endAt").isDate(),
  body("isActive").isBoolean(),
  body("roomId").isString(),
  auctionController.create
);
app.get("/auction", auctionController.getAll);
// ----- Pages
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname + "/admin.html"));
});

// ----- Socket.IO
io.on("connection", function (socket) {
  const roomId = socket.handshake.query.zoneId;

  socket.join(roomId);

  socket.on("join", (data) => {
    let decoded = jwt_decode(data.userToken);
    Auction.findOne({
      where: {
        roomId: decoded.room + roomId,
      },
    })
      .then((auction) => {
        io.to(roomId).emit("joined", { auction: auction });

        Product.findAll({
          where: {
            AuctionId: auction.id,
            isSold: false,
          },
        }).then((productsForSale) => {
          io.to(roomId).emit("products-for-sale", {
            products: productsForSale,
          });
        });

        Product.findAll({
          where: {
            AuctionId: auction.id,
            isSold: true,
          },
        }).then((productsSold) => {
          io.to(roomId).emit("products-sold", { products: productsSold });
        });

        Product.findOne({
          where: {
            AuctionId: auction.id,
            isSold: false,
          },
          include: [
            {
              model: Bid,
            },
          ],
          order: [[Bid, "price", "DESC"]],
        }).then((product) => {
          io.to(roomId).emit("active-product", { product: product });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on("new-bid", (data) => {
    let decoded = jwt_decode(data.userToken);
    Auction.findOne({
      where: {
        roomId: decoded.room + roomId,
      },
    }).then(() => {
      Product.findByPk(data.productId).then((product) => {
        Bid.create({
          userUID: decoded.user,
          price: data.bid,
          ProductId: product.id,
        }).then(() => {
          Product.findOne({
            where: {
              id: product.id,
            },
            include: [
              {
                model: Bid,
              },
            ],
            order: [[Bid, "price", "DESC"]],
          }).then((product) => {
            io.to(roomId).emit("active-product", { product: product });
          });
        });
      });
    });
  });

  socket.on("disconnect", onDisconnect);

  function onDisconnect() {
    console.log("Received: disconnect event from client: " + socket.id);
    socket.removeListener("disconnect", onDisconnect);
  }
});

http.listen(app.get("port"), function () {
  console.log("Server started on port " + app.get("port"));
});
