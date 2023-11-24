const {
  getArticleById,
  patchVotes,
  getArticles,
  postArticle,
} = require("../controllers/articles-controller");
const {
  getArticleComments,
  postComment,
} = require("../controllers/comments.controller");

const articleRouter = require("express").Router();

articleRouter.route("/").get(getArticles).post(postArticle)

articleRouter.route("/:article_id").get(getArticleById).patch(patchVotes);

articleRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postComment)

module.exports = articleRouter;
