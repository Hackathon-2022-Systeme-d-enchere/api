const connection = require("../index");
const {Model, DataTypes} = require("sequelize");
const Auction = require("./Auction");

class Product extends Model {
}

Product.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        auctionIds: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING
        },
        minPrice: {
            type: DataTypes.DOUBLE
        },
        isSold: {
            type: DataTypes.BOOLEAN
        }
    },
    connection
);

Auction.Products = Auction.hasMany(Product, {
    as: "Products",
    foreignKey: "auctionId",
});

Product.belongsTo(Auction, {as: "auction"}); // unique author

connection.sequelize.sync()
    .then(() => {
        console.log('Product db and user table have been created')
    });

module.exports = Product;
