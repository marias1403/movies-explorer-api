const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const validationConstants = require('../utils/constants');

const validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateUserBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error(validationConstants.URL_JOI_VALIDATION_ERROR);
  }
  return value;
};

const validateMovieBody = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().custom(validateURL, 'custom link validation').required(),
    trailer: Joi.string().custom(validateURL, 'custom link validation').required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().custom(validateURL, 'custom link validation').required(),
    movieId: Joi.number().required(),
  }),
});

const validateDeleteBody = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
});

const validateUpdateUserBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

module.exports = {
  validateAuthentication,
  validateUserBody,
  validateMovieBody,
  validateDeleteBody,
  validateUpdateUserBody,
};
