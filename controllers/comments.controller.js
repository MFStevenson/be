const { selectCommentsByArticleId } = require("../models/comments-model");

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;

  selectCommentsByArticleId(article_id)
    .then((comments) => {
      return res.status(200).send({ comments });
    })
    .catch(next);
};
