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
                       COUNT(comments.comment_id) AS comment_count
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
                comment_count: parseInt(article.comment_count)
            }));
        });
}