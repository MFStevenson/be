const express = require("express");
const { handle404, getTopics } = require("./controllers/topics-controller");
const { handleCustonErrors, handleServerErrors } = require("./error-handler");
const app = express();

app.use(express.json());

app.get('/api/topics', getTopics)
app.all("*", handle404);

app.use(handleCustonErrors);
app.use(handleServerErrors);

module.exports = app;
