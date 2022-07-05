const passport = require('passport');
const User = require('../models/User.js');
const AuthController = {};

AuthController.register = function(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect('/')
	}
	User.findOne({ username: req.body.username }, function(err, user) {
		if (err) {
			return res.redirect('/');
		}
		if (user) {
			return res.redirect('/auth/login');
		} else {
			const newUser = new User({
				username: req.body.username,
				password: req.body.password
			})
			newUser.save().then(user => {
				
				return	res.send(user);
			}).catch(err => {
				console.error(err);
				return res.send('Error');
			});
		}
	});
}

AuthController.login = function(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect('/');
	}

	passport.authenticate('local', function(err, user, info) {
		if (err) { return next(err); }
		if (!user) { return res.redirect('/auth/login'); }
		req.logIn(user, function(err) {
			if (err) { return next(err); }
			return res.redirect('/welcome');
		});
	})(req, res, next);
}

AuthController.logout = function(req, res, next) {
	req.logout();
	res.redirect('/');

}
module.exports = AuthController;
