const express = require('express');
const {getAllTopics} = require('./controllers/topicsController')
const {handleServerErrors} = require('./errors/errorHandling.js');

const app = express()

app.use(express.json());

app.use(handleServerErrors); // keep this at the bottom of the errors list

app.get('/api', (req, res) => {
    res.status(200).send({msg: "all ok"})
})

app.get('/api/topics', getAllTopics)

module.exports = app
