const express = require('express');
const {getAllTopics} = require('./controllers/topicsController')
const {getCommentsByArticleId} = require('./controllers/commentsController')
const {getAllArticles, getArticleById} = require('./Controllers/articlesController')
const {handleServerErrors, handles404NotFoundErrors, handlesPSQLErrors, handlesCustomErrors} = require('./errors/errorHandling.js');

const app = express()

app.get('/api', (req, res) => {
    res.status(200).send({msg: "all ok"})
})

app.get('/api/topics', getAllTopics)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles/:article_id/comments',getCommentsByArticleId)

app.use(handles404NotFoundErrors);
app.use(handlesPSQLErrors);
app.use(handlesCustomErrors);
app.use(handleServerErrors); // keep this at the bottom of the errors list

module.exports = app
