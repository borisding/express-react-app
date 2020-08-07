const usersRouter = require('express').Router();

usersRouter.get('/', (req, res) => {
  return res.json([{ id: 1, name: 'Guest' }]);
});

module.exports = usersRouter;
