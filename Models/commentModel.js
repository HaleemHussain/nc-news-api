const db = require("../db/connection");

exports.selectCommentsByArticleId = (article_id) => {
    const idNum = parseInt(article_id)
    if (!Number.isNaN(idNum)) {
        return db
            .query(`SELECT *
                    FROM comments
                    WHERE article_id = $1;`, [article_id])
            .then((result) => {
                if (result.rows.length === 0) {
                    return Promise.reject({
                        status: 404,
                        msg: `No comments found for article_id: ${article_id}`
                    });
                } else {
                    return db.query(`SELECT *
                                     FROM comments
                                     WHERE article_id = $1;`, [article_id])
                        .then((response) => {
                            return response.rows
                        })
                }
            })
    } else {
        return Promise.reject({
            status: 400,
            msg: 'bad request'
        })
    }
}
