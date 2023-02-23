
exports.handles404NotFoundErrors = (req, res, next) => {
    res.status(404).send({ msg: "not found" });
};

exports.handlesCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
};

exports.handlesPSQLErrors= (err, req, res, next) => {
    if (err.code === "22P02" || err.code === "23502") {
        res.status(400).send({ msg: "bad request" });
    } else if (err.code === "23503") {
        res.status(404).send({ msg: "not found" });
    } else {
        next(err);
    }
};

//keep this at the bottom
exports.handleServerErrors = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
};