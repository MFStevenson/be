const express = require("express");
const cors = require("cors");
const {
  handleCustomErrors,
  handleServerErrors,
  handlePsqlErrors,
} = require("./error-handler");

const { handle404 } = require("./controllers/topics-controller");
const apiRouter = require("./routes/api-router");

const app = express();

app.use(cors())
app.use(express.json());

app.use("/api", apiRouter);

app.all("*", handle404);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
