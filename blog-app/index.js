const logger = require('./utlis/logger');
const config = require('./utlis/config');
const { app } = require('./app');

app.listen(config.PORT, () => {
  logger.info('Listening on port ', config.PORT);
});
