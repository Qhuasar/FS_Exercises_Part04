const logger = require("./logger");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const errorHandler = (error, req, res, next) => {
  logger.error(JSON.parse(JSON.stringify(error)));
  switch (error.name) {
    case "ValidationError":
      res.status(400).end();
      break;
    case "CastError":
      res.statusMessage = "Malformed id";
      res.status(400).end();
    default:
      next(error);
  }
  next(error);
};

module.exports = {
  requestLogger,
  errorHandler,
};
