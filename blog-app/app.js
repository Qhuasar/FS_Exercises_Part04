const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('./utlis/logger');
const config = require('./utlis/config');
const blogRouter = require('./controlers/blogs');
const usersRouter = require('./controlers/users');
const loginRouter = require('./controlers/login');
const {
  errorHandler,
  requestLogger,
  getTokenFrom,
} = require('./utlis/middleware');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.set('strictQuery', false);
mongoose
  .connect(config.MONGO_URI)
  .then(() => logger.info('connected to ', config.MONGO_URI))
  .catch((error) => {
    logger.error('error connecting to MongoDB', error.message);
  });
app.use(requestLogger);
app.use(getTokenFrom);

app.use('/api/blogs', blogRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(errorHandler);

module.exports = {
  app,
};
