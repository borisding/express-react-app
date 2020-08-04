const paths = require('./paths');
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  isDev,
  paths
};
