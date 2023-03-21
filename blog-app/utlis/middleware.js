const jwt = require('jsonwebtoken');
const logger = require('./logger');
const { SECRET } = require('./config');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

const errorHandler = (error, req, res, next) => {
  // logger.error(JSON.parse(JSON.stringify(error)));
  switch (error.name) {
    case 'ValidationError':
      res.status(400).json({ error: error.message });
      break;
    case 'CastError':
      res.statusMessage = 'Malformed id';
      res.status(400).json({ error: error.message });
      break;
    case 'JsonWebTokenError':
      res.status(401).json({ error: error.message });
      break;
    case 'Authorization':
      res.status(403).json({ error: error.message });
      break;
    case 'TokenExpiredError':
      res.status(401).json({ error: 'expired token' });
      break;
    default:
      next(error);
  }
  next(error);
};

const getTokenFrom = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('bearer ')) {
    request.token = authorization.replace('bearer ', '');
    next();
  } else {
    request.token = null;
    next();
  }
};

const userExtractor = async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, SECRET);
    if (!decodedToken.id) {
      response.status(401).json({ error: 'token invalid' });
    } else {
      request.user = decodedToken.id;
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getTokenFrom };

module.exports = {
  requestLogger,
  errorHandler,
  getTokenFrom,
  userExtractor,
};
