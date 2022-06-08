const connection = require("../index");
const {Model, DataTypes} = require("sequelize");
const Product = require("./Product");

class Bid extends Model {
}

Bid.init(
    {
        price: {
            type: DataTypes.DOUBLE
        },
        createdAt: {
            type: DataTypes.DATE
        }
    },
    connection
);

Product.Bids = Product.hasMany(Product, {
    as: "Bids",
    foreignKey: "productId",
});

Bid.belongsTo(Product, {as: "product"}); // unique author

connection.sequelize.sync()
    .then(() => {
        console.log('Bid db and user table have been created')
    });

module.exports = Product;
