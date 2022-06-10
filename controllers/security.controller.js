const {User} = require("../models/index");
const bcrypt = require("bcryptjs");
const {createJWT} = require("../lib/security");

exports.login = async (req, res) => {
    const {username, password} = req.body;
    const foundUser = await User.findOne({
        where: {
            "username": username,
        }
    });

    if (!foundUser || !bcrypt.compareSync(password, foundUser.password)) {
        return res.status(400).json({'message': 'Information invalides'});
    } else {
        createJWT({id: foundUser.username, roles: [foundUser.role]})
            .then((token) => res.json({token: token}));
    }
}

exports.register = async (req, res) => {
    const {username, role, password} = req.body;
    const foundUser = await User.findOne({
        where: {
            "username": username,
        }
    });

    if (!foundUser) {
        const user = new User({
            "username": username,
            "role": role,
            "password": password
        });

        user.save();
        res.status(201).json('User created');
    } else {
        res.status(409).json({message: "User already exists!"});
    }
}
