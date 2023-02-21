const {selectTopics} = require('../models/topicModel')

exports.getAllTopics = (req, res) => {
    selectTopics().then((result) => {
        res.status(200).send({topics: result})
    });
}