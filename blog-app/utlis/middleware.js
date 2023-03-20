const logger = require("./logger");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const errorHandler = (error, req, res, next) => {
  //logger.error(JSON.parse(JSON.stringify(error)));
  switch (error.name) {
    case "ValidationError":
      res.status(400).json({ error: error.message });
      break;
    case "CastError":
      res.statusMessage = "Malformed id";
      res.status(400).json({ error: error.message });
      break;
    case "JsonWebTokenError":
      res.status(400).json({ error: error.message });
      break;
    default:
      next(error);
  }
  next(error);
};

const getTokenFrom = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("bearer ")) {
    request.token = authorization.replace("bearer ", "");
    next();
  } else {
    request.token = null;
    next();
  }
};

module.exports = { getTokenFrom };

module.exports = {
  requestLogger,
  errorHandler,
  getTokenFrom,
};
