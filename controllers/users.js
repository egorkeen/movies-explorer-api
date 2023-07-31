const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const AuthorizeError = require('../errors/AuthorizeError');
const ConflictError = require('../errors/ConflictError');

const { JWT_SECRET, NODE_ENV } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then(({ _id }) => {
      if (_id) {
        const token = jwt.sign(
          { _id },
          NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
          { expiresIn: '7d' },
        );

        return res.status(200).send({ token });
      }

      throw new AuthorizeError('Неверные почта или пароль');
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create(
      {
        name,
        email,
        password: hash,
      },
    ))
    .then((user) => {
      res.status(200).send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с такой почтой уже существует.'));
      } else if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные для регистрации.'));
      } else {
        next(err);
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с таким id не найден');
      }

      return res.status(200).send({
        name: user.name,
        email: user.email,
        _id: user._id
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Передан некорректный id пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    {
      name,
      email,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с данным id не найден');
      }
      return res.status(200).send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Передан некорректный id пользователя'));
      } else if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
