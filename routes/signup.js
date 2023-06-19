const registerRouter = require('express').Router();

const {
  createUser,
} = require('../controllers/users');
const { celebrateCreateUser } = require('../middlewares/celebrate');

registerRouter.post('/signup', celebrateCreateUser, createUser);

module.exports = registerRouter;
