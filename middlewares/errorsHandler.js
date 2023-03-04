const validationConstants = require('../utils/constants');

const errorsHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? validationConstants.SERVER_ERROR
        : message,
    });
  next();
};

module.exports = errorsHandler;
