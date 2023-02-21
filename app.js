const express = require('express');
const {getAllTopics} = require('./controllers/topicsController')
const {getAllArticles} = require('./Controllers/articlesController')
const {handleServerErrors} = require('./errors/errorHandling.js');

const app = express()

app.get('/api', (req, res) => {
    res.status(200).send({msg: "all ok"})
})

app.get('/api/topics', getAllTopics)

app.get('/api/articles', getAllArticles)

app.use(handleServerErrors); // keep this at the bottom of the errors list

module.exports = app
