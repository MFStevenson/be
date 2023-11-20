const express = require("express");
const { handleCustomErrors, handleServerErrors, handlePsqlErrors } = require("./error-handler");
const { getArticleById } = require("./controllers/articles-controller");
const { handle404, getTopics, getEndpoints } = require("./controllers/topics-controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);


app.get("/api/articles/:article_id", getArticleById);


app.get('/api', getEndpoints)

app.all("*", handle404);

app.use(handlePsqlErrors)
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
