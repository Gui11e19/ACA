/*
checks if an user is logged and sets user information making user that the object
userInfo exist, useful for views
*/
const getUserInfo = require('../helpers/userInfo.js') // especificamos de donde se requiere la informacion
function setUserInfo(req, res, next) {
	if (req.isAuthenticated()) {
		userInfo = getUserInfo(true, req.user.username);

	} else {
		userInfo = getUserInfo(false, "");
	}
	next();
}
// Exportando funcion getUserInfo
module.exports = setUserInfo