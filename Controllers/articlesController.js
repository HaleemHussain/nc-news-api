const {selectArticles, selectArticleById} = require('../Models/articleModel')

exports.getAllArticles = (req, res, next) => {
    selectArticles()
        .then((result) => {
            res.status(200).send({articles: result})
        })
        .catch((err) => {
            next(err)
        });
}

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    selectArticleById(article_id)
        .then((result) => {
            res.status(200).send({article: result})
        })
        .catch((err) => {
            next(err)
        });
}

