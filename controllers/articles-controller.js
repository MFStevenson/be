const {
  selectArticleById,
  selectArticles,
  updateArticleVotes,
  checkArticleIdExists,
} = require("../models/articles-model");
const { checkTopicExists } = require("../models/topics-model");

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
  const { topic } = req.query;

  if (topic) {
    checkTopicExists(topic)
      .then(() => {
        return selectArticles(topic);
      })
      .then((articles) => {
        return res.status(200).send({ articles });
      })
      .catch(next);
  } else {
    selectArticles()
      .then((articles) => {
        return res.status(200).send({ articles });
      })
      .catch(next);
  }
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
