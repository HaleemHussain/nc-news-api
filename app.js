const express = require('express');
const cors = require('cors');
const {getAllUsers} = require('./Controllers/usersController');
const {getAllTopics} = require('./Controllers/topicsController');
const {getCommentsByArticleId, postComment} = require('./Controllers/commentsController');
const {getAllArticles, getArticleById, patchArticle} = require('./Controllers/articlesController');
const {handleServerErrors, handles404NotFoundErrors, handlesPSQLErrors, handlesCustomErrors} = require('./errors/errorHandling.js');

const app = express()

app.use(cors());

app.use(express.json());

app.get('/api', (req, res) => {
    res.status(200).send({msg: "all ok"})
})

app.get('/api/topics', getAllTopics)

app.get('/api/articles', getAllArticles)

app.get('/api/users', getAllUsers)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles/:article_id/comments',getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postComment)

app.patch('/api/articles/:article_id', patchArticle)

app.use(handles404NotFoundErrors);
app.use(handlesPSQLErrors);
app.use(handlesCustomErrors);
app.use(handleServerErrors); // keep this at the bottom of the errors list

module.exports = app
