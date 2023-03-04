const http2 = require('node:http2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const validationConstants = require('../utils/constants');

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    }))
    .then((user) => res.send({
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError(validationConstants.CREATE_USER_VALIDATION_ERROR));
      }
      if (err.code === 11000) {
        next(new ConflictError(validationConstants.CREATE_USER_CONFLICT_ERROR));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

const getCurrentUserInfo = (req, res, next) => User.findOne({ _id: req.user._id })
  .then((user) => {
    if (user === null) {
      throw new NotFoundError(validationConstants.USER_NOT_FOUND_ERROR);
    }
    return res.status(http2.constants.HTTP_STATUS_OK).send({ data: user });
  })
  .catch(next);

const updateUserProfile = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user === null) {
        throw new NotFoundError(validationConstants.USER_NOT_FOUND_ERROR);
      }
      return res.status(http2.constants.HTTP_STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(validationConstants.UPDATE_USER_VALIDATION_ERROR));
      }
      if (err.code === 11000) {
        next(new ConflictError(validationConstants.CREATE_USER_CONFLICT_ERROR));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser, login, getCurrentUserInfo, updateUserProfile,
};
