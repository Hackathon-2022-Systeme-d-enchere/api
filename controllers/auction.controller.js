const {Auction} = require("../models/index");
const {validationResult} = require("express-validator");
const {Product} = require("../models/index");

exports.getAll = async (req, res) => {
    const auctions = await Auction.findAll();
    res.json(auctions);
};

exports.create = async (req, res) => {
    const {name, startAt, isActive, roomId, products} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const auction = new Auction({
        name: name, startAt: startAt, isActive: isActive, roomId: roomId,
    });

    auction
        .save()
        .then((response) => {
            products.forEach(product => {
                Product.update({
                    AuctionId: response.toJSON().id
                }, {
                    where: {id: product}
                })
            })
            res.status(201).json('ok')
        })
        .catch((e) => {
            res.status(500).json(e);
        });
};
