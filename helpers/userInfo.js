//creates userInfo object for use in views
function getUserInfo(isLogged, username) {
	const userInfo = {

		isLogged : isLogged,
		username : username

	};

	return	userInfo;

}


module.exports = getUserInfo;
