require('dotenv').config()
const jwt = require("jsonwebtoken");

exports.verifJWT = function verifJWT(token) {
    return new Promise((res, rej) =>
        jwt.verify(token, process.env.TOKEN, (err, decoded) => {
            if (err) rej(err);
            else res(decoded);
        })
    );
};

exports.createJWT = function createJWT(user) {
    return new Promise((res, rej) =>
        jwt.sign(
            user,
            process.env.TOKEN,
            {expiresIn: 3600},
            (err, decoded) => {
                if (err) rej(err);
                else res(decoded);
            }
        )
    );
};
