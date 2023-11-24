const {
  selectArticleById,
  selectArticles,
  updateArticleVotes,
  checkArticleIdExists,
  insertArticle,
} = require("../models/articles-model");
const { checkTopicExists } = require("../models/topics-model");
const { checkUserExists } = require("../models/users-model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((article) => {
      if (!article) {
        return res.status(404).send({ msg: "article at id not found" });
      } else {
        res.status(200).send({ article });
      }
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;

  selectArticles(topic, sort_by, order)
    .then((articles) => {
      return res.status(200).send({ articles });
    })
    .catch(next);
};

exports.patchVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  checkArticleIdExists(article_id)
    .then(() => {
      return updateArticleVotes(article_id, inc_votes);
    })
    .then((updatedArticle) => {
      return res.status(200).send({ updatedArticle });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;

  const validationPromises = [checkUserExists(author), checkTopicExists(topic)];

  Promise.all(validationPromises)
    .then(() => {
      return insertArticle(author, title, body, topic, article_img_url);
    })
    .then((postedArticle) => {
      return res.status(201).send({ postedArticle });
      
    })
    .catch(next);
};
