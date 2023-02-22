const {selectCommentsByArticleId} = require('../models/commentModel')

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    selectCommentsByArticleId(article_id)
        .then((result) => {
            console.log(result)
            res.status(200).send({comments: result})
        })
        .catch((err) =>{
            next(err)
        });

}