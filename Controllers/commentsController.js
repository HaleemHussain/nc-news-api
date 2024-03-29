const {selectCommentsByArticleId, insertComment, deleteComment} = require('../Models/commentModel')

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    selectCommentsByArticleId(article_id)
        .then((result) => {
            res.status(200).send({comments: result})
        })
        .catch((err) => {
            next(err)
        });
}

exports.postComment = (req, res, next) => {
    const {article_id} = req.params;
    insertComment(article_id, req.body)
        .then((comment) => {
            res.status(201).send({comment})
        })
        .catch((err) => {
            next(err);
        })
}
exports.deleteCommentById = (req, res, next) => {
    const {comment_id} = req.params;
    deleteComment(comment_id)
        .then(() => {
            res.sendStatus(204);
        })
        .catch((err) => {
            next(err);
        });
};