const express = require("express");
const { handle404, getTopics } = require("./controllers/topics-controller");
const { handleCustonErrors, handleServerErrors, handlePsqlErrors } = require("./error-handler");
const { getArticleById } = require("./controllers/articles-controller");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);


app.get("/api/articles/:article_id", getArticleById);

app.all("*", handle404);

app.use(handlePsqlErrors)
app.use(handleCustonErrors);
app.use(handleServerErrors);

module.exports = app;
