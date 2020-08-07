const morgan = require('morgan');
const logger = require('../logger');
const { isDev } = require('../../utils');

// winston logger writable stream for morgan
logger.stream = {
  write: message => {
    logger.info(message);
  }
};

const httpLogger = () => {
  return morgan(isDev ? 'dev' : 'combined', {
    stream: logger.stream,
    skip: (req, res) => res.statusCode < 400
  });
};

module.exports = httpLogger;
