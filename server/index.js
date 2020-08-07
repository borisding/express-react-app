const express = require('express');
const chalk = require('chalk');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const hpp = require('hpp');
const { httpLogger, errorHandler } = require('./middleware');

const app = express();

app.use(httpLogger());
app.use(helmet());
app.use(hpp());
app.use(cookieParser());
app.use(compression());
app.use(errorHandler());

const { PORT = 5000 } = process.env;
app.listen(PORT, error => {
  if (error) {
    console.error(`ERROR: ${chalk.red(error)}`);
  } else {
    console.info(chalk.cyan(`Express server is listenting PORT (${PORT})`));
  }
});
