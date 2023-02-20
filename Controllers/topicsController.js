const {selectTopics} = require('../models/topicModel')

exports.getAllTopics = (req, res) => {
    return selectTopics().then((result) => {
        return res.status(200).send({topics: result})
    });
}