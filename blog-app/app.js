const config = require("./utlis/config");
const logger = require("./utlis/logger");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const blogRouter = require("./controlers/blogs");
const usersRouter = require("./controlers/users");
const loginRouter = require("./controlers/login");
const { errorHandler, requestLogger, getTokenFrom } = require("./utlis/middleware");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.set("strictQuery", false);
mongoose
  .connect(config.MONGO_URI)
  .then(() => logger.info("connected to ", config.MONGO_URI))
  .catch((error) => {
    logger.error("error connecting to MongoDB", error.message);
  });
app.use(requestLogger);
app.use(getTokenFrom);

app.get("/api/blogs", blogRouter);
app.post("/api/blogs", blogRouter);
app.delete("/api/blogs/:id", blogRouter);
app.put("/api/blogs/:id", blogRouter);

app.get("/api/users", usersRouter);
app.post("/api/users", usersRouter);

app.post("/api/login", loginRouter);

app.use(errorHandler);

module.exports = {
  app,
};
