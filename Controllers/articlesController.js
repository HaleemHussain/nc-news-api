const {selectArticles, selectArticleById, updateArticle} = require('../Models/articleModel')

exports.getAllArticles = (req, res, next) => {
    const { sort_by, order } = req.query;
    let filter = {};

    for (let key in req.query) {
        if (key !== "sort_by" && key !== "order") {
            filter[key] = req.query[key];
        }
    }
    selectArticles(order, sort_by, filter)
        .then((articles) => {
            res.status(200).send({ articles });
        })
        .catch((err) => {
            next(err);
        });
};

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

exports.patchArticle = (req, res, next) => {
    const {article_id} = req.params;
    updateArticle(article_id, req.body)
        .then((result) => {
            res.status(200).send({article: result})
        })
        .catch((err) => {
            next(err)
        });
}