//creates userInfo object for use in views
function getUserInfo(isLogged, username) {
	const userInfo = {

		isLogged : isLogged,
		username : username

	};
	// Retorna la informacion de loggeo
	return	userInfo;

}

// Exportamos la funcion getUserInfo
module.exports = getUserInfo;
