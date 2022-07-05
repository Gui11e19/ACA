/*
checks if an user is logged and sets user information making user that the object
userInfo exist, useful for views
*/
const getUserInfo = require('../helpers/userInfo.js')
function setUserInfo(req, res, next) {
	if (req.isAuthenticated()) {
		userInfo = getUserInfo(true, req.user.username);

	} else {
		userInfo = getUserInfo(false, "");
	}
	next();
}



module.exports = setUserInfo
