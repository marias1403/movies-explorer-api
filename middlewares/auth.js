const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');
const validationConstants = require('../utils/constants');

module.exports = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(validationConstants.UNAUTHORIZED_ERROR);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret');
  } catch (err) {
    throw new UnauthorizedError(validationConstants.UNAUTHORIZED_ERROR);
  }
  req.user = payload;
  next();
};
