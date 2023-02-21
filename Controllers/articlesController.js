const {selectArticles} = require('../models/articleModel')

exports.getAllArticles = (req, res) => {
    selectArticles().then((result) => {
        res.status(200).send({articles: result})
    });
}