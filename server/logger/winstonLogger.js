const { format, transports, createLogger } = require('winston');
const { isDev, paths } = require('../../utils');

const { combine, json, timestamp, label } = format;

const winstonLogger = createLogger({
  exitOnError: false,
  transports: [
    new transports.File({
      level: 'info',
      filename: `${paths.storage}/logs/access.log`
    }),
    new transports.File({
      level: 'error',
      filename: `${paths.storage}/logs/errors.log`,
      format: combine(
        label({ label: 'ERROR:' }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        json()
      )
    })
  ]
});

// add console only for development
if (isDev) {
  winstonLogger.add(
    new transports.Console({
      handleExceptions: true
    })
  );
}

module.exports = winstonLogger;
