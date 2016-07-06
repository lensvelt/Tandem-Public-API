var decodeToken = require('./auth').decodeToken;
var router = require('express').Router();
var throttle = require('../middleware/apiRateLimiter');
var authController = require('./authController');
var verifyExistingUser = require('./auth').verifyExistingUser;
var addNewUser = require('./auth').addNewUser;
var validateMail = require('./auth').validateMail;

/*********************************************
* NOTE: All routes relative to '/auth'
*********************************************/

//ALL ROUTES (/auth)- API rate limiting middleware function
router.use(throttle());

//NO AUTH - render login page
router.get('/login', (req, res) => {
  res.render('login');
});

//NO AUTH - render new sign up page
router.get('/signup', (req, res) => {
  res.render('signup');
});

//NO AUTH - process initial signup details & send verification email
router.post('/signup', addNewUser(), authController.signUp);

//NO AUTH - update user info based on email verification
router.get('/verify', validateMail(), authController.verify);

//BASIC AUTH - verify is existing user & log them in - return signed JWT token - check login details & return token in authController
router.post('/dashboard', verifyExistingUser(), authController.dashboard);

//BEARER AUTH - check user already signed in & valid
// router.post('/newkey', decodeToken(), authController.dashboard);

module.exports = router;