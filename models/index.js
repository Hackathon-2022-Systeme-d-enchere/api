'use strict';

const fs = require('fs');
const path = require('path');
const Index = require('sequelize');
const bcrypt = require("bcryptjs");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Index(process.env[config.use_env_variable], config);
} else {
    sequelize = new Index(config.database, config.username, config.password, config);
}

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Index.DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Index;
db.Product.hasMany(db.Bid)
db.Auction.hasMany(db.Product)
db.User.hasMany(db.Auction)


db.User.beforeCreate(async (user, options) => {
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);
})

module.exports = db;
