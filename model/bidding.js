const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Bidding = sequelize.define('Bidding', {
    // Model attributes are defined here
    auctionId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.STRING
    },
    userId: {
        type: DataTypes.STRING
    },
    createdAt: {
        type: DataTypes.DATE
    }
}, {
    // Other model options go here
});

// `sequelize.define` also returns the model
console.log(Bidding === sequelize.models.Bidding); // true
