module.exports = (sequelize, Sequelize) => {
    const BidModel = sequelize.define("Bid", {
        userUID: {
            type: Sequelize.STRING
        },
        price: {
            type: Sequelize.DOUBLE
        }
    })
    return BidModel;
}
