const express = require('express');
const chalk = require('chalk');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const hpp = require('hpp');
const { httpLogger, errorHandler, notFoundHandler } = require('./middleware');
const { users } = require('./routers');
const { isDev, paths } = require('../utils');

const app = express();

app.use(httpLogger());
app.use(helmet());
app.use(hpp());
app.use(cookieParser());
app.use(compression());

app.use('/api/users', users);

// serve files in production environment
if (!isDev) {
  app.use('/build', express.static(`${paths.public}/build`));
  app.get('*', (req, res) => {
    res.sendFile(`${paths.public}/index.html`);
  });
}

app.use(notFoundHandler());
app.use(errorHandler());

const { PORT = 5000 } = process.env;
app.listen(PORT, error => {
  if (error) {
    console.error(`ERROR: ${chalk.red(error)}`);
  }
  console.info(chalk.cyan(`Express server is listening PORT (${PORT})`));
});
