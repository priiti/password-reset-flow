const router = require('express').Router();
const authController = require('./controllers/authController');

router.post('/account/signup', authController.signUp);
router.post('/account/forgot', authController.forgot);
router.get('/account/reset/:token', authController.reset);
router.post('/account/reset/:token', 
  authController.confirmedPasswords,
  authController.update
);

module.exports = router;
