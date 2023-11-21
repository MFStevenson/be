const express = require("express");
const {
  handleCustomErrors,
  handleServerErrors,
  handlePsqlErrors,
} = require("./error-handler");
const {
  getArticleById,
  getArticles,
  patchVotes,
} = require("./controllers/articles-controller");
const {
  handle404,
  getTopics,
  getEndpoints,
} = require("./controllers/topics-controller");
const {
  getArticleComments,
  postComment,
  deleteComment,
} = require("./controllers/comments.controller");
const { getUsers } = require("./controllers/users-controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchVotes)
app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);
app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api", getEndpoints);

app.get("/api/users", getUsers);

app.all("*", handle404);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
