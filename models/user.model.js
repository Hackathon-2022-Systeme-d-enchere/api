module.exports = (sequelize, Sequelize) => {
    const UserModel = sequelize.define("User", {
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        role: {
            type: Sequelize.STRING,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: true
        },
    })
    return UserModel;
}
