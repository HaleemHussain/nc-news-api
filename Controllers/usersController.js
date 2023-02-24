const { selectUsers } = require("../Models/userModel");

exports.getAllUsers = (req, res, next) => {
    selectUsers()
        .then((users) => {
            res.status(200).send({ users });
        })
        .catch((err) => {
            next(err);
        });
};
