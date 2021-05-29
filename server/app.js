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

app.use(helmet());
app.use(httpLogger());
app.use(cookieParser());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }), hpp());

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

const PORT = parseInt(process.env.PORT, 10) || 5000;
app
  .listen(PORT, () => {
    console.info(chalk.cyan(`Express server is listening PORT (${PORT})`));
  })
  .on('error', error => {
    console.error(`ERROR: ${chalk.red(error.message)}`);
  });
