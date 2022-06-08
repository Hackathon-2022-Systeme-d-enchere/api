const connection = require("../index");
const {Model, DataTypes} = require("sequelize");

class Auction extends Model {
}

Auction.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        startAt: {
            type: DataTypes.DATE
        },
        endAt: {
            type: DataTypes.DATE
        },
        owner: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    connection
);

connection.sequelize.sync()
    .then(() => {
        console.log('Transaction db and user table have been created')
    });

module.exports = Auction;
