const router = require('express').Router();

const userRouter = require('./users');
const movieRouter = require('./movies');
const loginRouter = require('./signin');
const registerRouter = require('./signup');
const auth = require('../middlewares/auth');

router.use(registerRouter);
router.use(loginRouter);
router.use(auth, userRouter);
router.use(auth, movieRouter);

module.exports = router;
