const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const AuthorizeError = require('../errors/AuthorizeError');

const userSchema = mongoose.Schema({

  name: {
    type: String,
    reqired: true,
    minLength: 2,
    maxLength: 30,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Введён некорректный email',
    },
  },

  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('password')
    .then((user) => {
      if (user) {
        return bcrypt.compare(password, user.password)
          .then((matched) => {
            if (matched) return user;
            return Promise.reject(new AuthorizeError('Неправильные почта или пароль'));
          });
      }

      return Promise.reject(new AuthorizeError('Неправильные почта или пароль'));
    });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
