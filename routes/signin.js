const loginRouter = require('express').Router();

const {
  login,
} = require('../controllers/users');

loginRouter.post('/signin', login);

module.exports = loginRouter;
