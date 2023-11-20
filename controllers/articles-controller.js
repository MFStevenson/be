const { selectArticleById } = require("../models/articles-model");

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
