//middleware to check if an user is logged in
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login');
}

// Exportando la funcion isLoggedIn
module.exports = isLoggedIn;