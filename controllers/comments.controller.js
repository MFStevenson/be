const { checkArticleIdExists } = require("../models/articles-model");
const {
  selectCommentsByArticleId,
  insertNewComment,
  removeCommentById,
  checkCommentIdExists,
} = require("../models/comments-model");
const { checkUserExists } = require("../models/users-model");

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;

  checkArticleIdExists(article_id)
    .then(() => {
      return selectCommentsByArticleId(article_id);
    })
    .then((comments) => {
      return res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;

  return insertNewComment(article_id, newComment)
    .then((postedComment) => {
      return res.status(201).send({ postedComment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  checkCommentIdExists(comment_id)
    .then(() => {
      return removeCommentById(comment_id);
    })
    .then(() => {
      return res.status(204).send();
    })
    .catch(next);
};
