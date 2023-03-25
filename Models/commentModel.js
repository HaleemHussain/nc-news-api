const db = require("../db/connection");

exports.selectCommentsByArticleId = (article_id) => {
    const queryValues = [article_id];
    let queryStr = "SELECT * FROM comments WHERE article_id = $1";
    if (isNaN(article_id)) {
        return Promise.reject({status: 400, msg: "bad request"});
    }
    return db.query(queryStr, queryValues).then((result) => {
        if (!result.rows.length) {
            return Promise.reject({
                status: 404,
                msg: `No comments found for article_id: ${article_id}`,
            });
        }
        return result.rows;
    });
};

exports.insertComment = (article_id, comment) => {
    const {username, body} = comment;
    return db.query(`INSERT INTO comments (author, body, article_id)
                     VALUES ($1, $2, $3) RETURNING *;`, [username, body, article_id])
        .then((result) => {
            return result.rows[0];
        });
};

exports.deleteComment = (comment_id) => {
    return db
        .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [
            comment_id,
        ])
        .then((result) => {
            if (!result.rows.length) {
                return Promise.reject({
                    status: 404,
                    msg: `No comment found for comment_id: ${comment_id}`,
                });
            }
        });
};