// sending page not found response when none of routes was matched
// @see: https://expressjs.com/en/4x/api.html#res.format

const code = 404;
const notFoundHandler = () => (req, res) => {
  res.status(code).format({
    json() {
      res.send({
        code,
        message: 'Resource not found.'
      });
    }
  });
};

module.exports = notFoundHandler;
