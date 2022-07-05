var express = require('express');
var router = express.Router();
const passport = require('passport');
const User = require('../models/User.js');
const AuthController = require('../controllers/authController.js')

router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.post('/logout', AuthController.logout);
router.get('/login', (req, res, next) => {
	res.render('login',{title:'login'});
}
);

router.get('/register', (req, res, next) => {
	res.render('register',{title:'register'});
}
);

router.get('/logout', function(req, res, next) {

	res.render('logout', { title: 'Express - Test' });
});


module.exports = router;
