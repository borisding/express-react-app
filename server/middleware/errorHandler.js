const logger = require('../logger');

// custom error handler
// eslint-disable-next-line no-unused-vars
const errorHandler = () => (err, req, res, next) => {
  const code = err.statusCode || 500;
  const name = err.name || 'Error';
  const message = err.message || 'Sorry! Something went wrong.';
  const errorData = { name, code, message };

  // logs error stack
  logger.error(err.stack);

  res.status(code).json(errorData);
};

module.exports = errorHandler;
