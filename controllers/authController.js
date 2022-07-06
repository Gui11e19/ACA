const passport = require("passport");
const User = require("../models/User.js");
const AuthController = {};
//register function
AuthController.register = function (req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  //checks if username already exixsts
  User.findOne({ username: req.body.username }, function (err, user) {
    if (err) {
      return res.redirect("/");
    }
    if (user) {
      return res.redirect("/auth/login");
    } else {
      const newUser = new User({
        username: req.body.username,
        password: req.body.password,
      });
      //saves the new user to the db
      newUser
        .save()
        .then((user) => {
          return res.send(user);
        })
        .catch((err) => {
          console.error(err);
          return res.send("Error");
        });
    }
  });
};
//login function
AuthController.login = function (req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }

  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    //if not logged in, should redirect to login page
    if (!user) {
      return res.redirect("/auth/login");
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/welcome");
    });
  })(req, res, next);
};
//logout function
AuthController.logout = function (req, res, next) {
  req.logout();
  res.redirect("/");
};
module.exports = AuthController;
