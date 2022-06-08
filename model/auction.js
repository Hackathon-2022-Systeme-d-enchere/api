const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Auction = sequelize.define('Auction', {
    // Model attributes are defined here
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
}, {
    // Other model options go here
});

// `sequelize.define` also returns the model
console.log(Auction === sequelize.models.Auction); // true
