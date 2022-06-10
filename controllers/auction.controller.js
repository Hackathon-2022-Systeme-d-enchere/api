const { Auction } = require("../models/index");
const { validationResult } = require("express-validator");
const path = require("path");

exports.getAll = async (req, res) => {
  const auctions = await Auction.findAll();
  res.json(auctions);
};

exports.create = async (req, res) => {
  const { name, startAt, endAt, isActive, roomId } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let fileUpload;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send("No files were uploaded.");
    return;
  }

  fileUpload = req.files.image;

  if (!["image/png", "image/jpeg"].includes(fileUpload.mimetype)) {
    res.status(400).send("Invalid file extension.");
    return;
  }

  uploadPath = "./uploads/" + fileUpload.name;

  fileUpload.mv(uploadPath, function (err) {
    if (err) {
      return res.status(500).send(err);
    }

    const auction = new Auction({
      name: name,
      startAt: startAt,
      endAt: endAt,
      isActive: isActive,
      roomId: roomId,
      image: "/upload/" + fileUpload.name,
    });

    auction
      .save()
      .then(res.status(201).json("auction created"))
      .catch((e) => {
        res.status(500).json(e);
      });
  });
};
