const db = require("../db/connection");

exports.selectArticles = () => {
    return db
        .query(`SELECT articles.author,
                       articles.title,
                       articles.article_id,
                       articles.topic,
                       articles.created_at,
                       articles.votes,
                       articles.article_img_url,
                       COUNT(comments.comment_id) :: INT AS comment_count
                FROM articles
                         LEFT JOIN comments ON articles.article_id = comments.article_id
                GROUP BY articles.article_id
                ORDER BY articles.created_at DESC;`)
        .then((articles) => {
            return articles.rows.map(article => ({
                author: article.author,
                title: article.title,
                article_id: article.article_id,
                topic: article.topic,
                created_at: article.created_at,
                votes: article.votes,
                article_img_url: article.article_img_url,
                comment_count: article.comment_count
            }));
        });
};

exports.selectArticleById = (article_id) => {
    return db
        .query(`SELECT *
                FROM articles
                WHERE article_id = $1;`, [article_id])
        .then(({rows}) => {
            const article = rows[0];
            if (!article) {
                return Promise.reject({
                    status: 404,
                    msg: `No article found for article_id: ${article_id}`,
                });
            }
            return article;
        });
};

exports.updateArticle = (article_id, input) => {
    return db.query(`UPDATE articles
                     SET votes = votes + $1
                     WHERE article_id = $2
                     RETURNING *`, [input.inc_votes, article_id]).then(({rows}) => {
        return rows[0];
    });
};
