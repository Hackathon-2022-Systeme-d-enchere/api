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
    // hash password before saving
    UserModel.beforeCreate((user, options) => {
        if (user.password) {
            user.password = bcrypt.hashSync(user.password, 10);
        }
    })
    return UserModel;
}
