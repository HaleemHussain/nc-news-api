const {selectArticles} = require('../models/articleModel')

exports.getAllArticles = (req, res) => {
    return selectArticles().then((result) => {
        return res.status(200).send({articles: result})
    });
}