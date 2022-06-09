module.exports = (sequelize, Sequelize) => {
    const AuctionModel = sequelize.define("Auction", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        startAt: {
            type: Sequelize.DATE
        },
        endAt: {
            type: Sequelize.DATE
        },
        owner: {
            type: Sequelize.STRING,
            allowNull: false
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        }
    })
    return AuctionModel;
}