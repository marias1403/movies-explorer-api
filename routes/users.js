const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCurrentUserInfo, updateUserProfile } = require('../controllers/users');

router.get('/me', getCurrentUserInfo);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    name: Joi.string().min(2).max(30),
  }),
}), updateUserProfile);

module.exports = router;
