const userRouter = require('express').Router();

const {
  getCurrentUser,
  updateUserProfile,
} = require('../controllers/users');

const { celebrateUpdateUserProfile } = require('../middlewares/celebrate');

const auth = require('../middlewares/auth');

userRouter.get('/users/me', auth, getCurrentUser);
userRouter.patch('/users/me', auth, celebrateUpdateUserProfile, updateUserProfile);

module.exports = userRouter;
