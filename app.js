const express = require("express");
const { handle404, getTopics, getEndpoints } = require("./controllers/topics-controller");
const { handleCustomErrors, handleServerErrors } = require("./error-handler");
const app = express();

app.use(express.json());

app.get('/api', getEndpoints)

app.get('/api/topics', getTopics)

app.all("*", handle404);

app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
