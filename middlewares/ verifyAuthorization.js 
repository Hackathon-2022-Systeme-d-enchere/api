const verifJWT = require("../lib/security").verifJWT;
const UserModel = require('../models/user.model');

module.exports = function (options) {
    return function verifyAuthorization(req, res, next) {
        const authorization =
            req.headers["Authorization"] ?? req.headers["authorization"];
        if (!authorization) {
            res.sendStatus(401);
            return;
        }
        const [type, token] = authorization.split(/\s+/);
        switch (type) {
            case "Bearer":
                verifJWT(token)
                    .then((user) => {
                        UserModel.findOne({username: user.id}).then((user) => {
                            req.user = user
                            next();
                        })
                    })
                    .catch(() => res.sendStatus(401));
                break;
        }
    };
};
