const router = require('express').Router();
const { getCurrentUserInfo, updateUserProfile } = require('../controllers/users');
const { validateUpdateUserBody } = require('../middlewares/validations');

router.get('/me', getCurrentUserInfo);

router.patch('/me', validateUpdateUserBody, updateUserProfile);

module.exports = router;
