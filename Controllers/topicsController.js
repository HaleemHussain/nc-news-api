const {selectTopics} = require('../Models/topicModel')

exports.getAllTopics = (req, res) => {
    selectTopics().then((result) => {
        res.status(200).send({topics: result})
    }).catch((err) => {
        next(err)
    });
}