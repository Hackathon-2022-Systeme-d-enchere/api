const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Product = sequelize.define('Product', {
    // Model attributes are defined here
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
}, {
    // Other model options go here
});

// `sequelize.define` also returns the model
console.log(Product === sequelize.models.Product); // true
