const { getEndpoints } = require("../controllers/topics-controller");

const apiRouter = require("express").Router();
const articleRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");

apiRouter.get("/", getEndpoints);

apiRouter.use("/articles", articleRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
