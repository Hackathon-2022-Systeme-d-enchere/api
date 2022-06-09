module.exports = (sequelize, Sequelize) => {
    const ProductModel = sequelize.define("Product", {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        image: {
            type: Sequelize.STRING
        },
        minPrice: {
            type: Sequelize.DOUBLE
        },
        isSold: {
            type: Sequelize.BOOLEAN
        }
    })
    return ProductModel;
}
