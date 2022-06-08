module.exports = (sequelize, Sequelize) => {
    const BidModel = sequelize.define("Bid", {
        price: {
            type: Sequelize.DOUBLE
        },
        createdAt: {
            type: Sequelize.DATE
        }
    })
    return BidModel;
}
