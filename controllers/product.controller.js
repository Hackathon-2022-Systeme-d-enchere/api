const {Product} = require("../models/index");
const {validationResult} = require("express-validator");
const path = require('path');

exports.getAll = async (req, res) => {
    const products = await Product.findAll();
    res.json(products)
}

exports.create = async (req, res) => {
    const {name, minPrice, isSold} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    let fileUpload;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).send('No files were uploaded.');
        return;
    }

    fileUpload = req.files.file;

    if (!['image/png', 'image/jpeg'].includes(fileUpload.mimetype)) {
        res.status(400).send('Invalid file extension.');
        return;
    }

    uploadPath = './uploads/' + fileUpload.name;

    fileUpload.mv(uploadPath, function (err) {
        if (err) {
            return res.status(500).send(err);
        }

        const product = new Product({
            "name": name,
            "minPrice": minPrice,
            "isSold": isSold,
            "image": '/upload/' + fileUpload.name,
        })

        product.save()
            .then(res.status(201).json(product))
            .catch(e => {
                res.status(500).json(e)
            })
    });
}
