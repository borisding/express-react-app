const httpLogger = require('./httpLogger');
const errorHandler = require('./errorHandler');
const notFoundHandler = require('./notFoundHandler');

module.exports = {
  errorHandler,
  notFoundHandler,
  httpLogger
};
