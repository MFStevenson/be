const { selectTopics, insertTopic } = require("../models/topics-model");

exports.handle404 = (req, res, next) => {
  res.status(404).send({ message: "path not found" });
};

exports.getEndpoints = (req, res, next) => {
  const endpoints = require("../endpoints.json");

  res.status(200).send({ endpoints });
};

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  const { slug, description } = req.body;

  insertTopic(slug, description)
    .then((newTopic) => {
      res.status(201).send({ newTopic });
    })
    .catch(next);
};
