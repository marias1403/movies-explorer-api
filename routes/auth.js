const router = require('express').Router();
const { validateUserBody, validateAuthentication } = require('../middlewares/validations');
const { createUser, login } = require('../controllers/users');

router.post('/signup', validateUserBody, createUser);

router.post('/signin', validateAuthentication, login);

module.exports = router;
