const db = require("../db/connection");

exports.selectArticles = (order = "DESC", sort_by = "created_at", filter) => {
    const queryValues = [];
    const capOrder = order.toUpperCase();
    const greenSorts = [
        "article_id",
        "title",
        "topic",
        "author",
        "body",
        "created_at",
        "votes",
        "comment_count",
    ];

    let queryStr =
        "SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments on comments.article_id = articles.article_id";

    if (!greenSorts.includes(sort_by)) {
        return Promise.reject({
            status: 400,
            msg: `bad request: cannot sort by '${sort_by}'`,
        });
    }
    if (capOrder !== "ASC" && capOrder !== "DESC") {
        return Promise.reject({
            status: 400,
            msg: `bad request: cannot order by '${order}', ASC or DESC only`,
        });
    }

    if (Object.keys(filter).length) {
        const [filterType] = Object.keys(filter);
        queryStr += ` WHERE ${filterType} = $1`;
        queryValues.push(...Object.values(filter));
    }

    queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${capOrder}`;

    return db.query(queryStr, queryValues).then((result) => {
        if (!result.rows.length) {
            return Promise.reject({
                status: 404,
                msg: `no article found for article_id ${article_id}`,
            });
        }
        return result.rows;
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
