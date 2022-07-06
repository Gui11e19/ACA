const bcrypt = require("bcryptjs");
const User = require("../models/User.js");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// Estrategia local
passport.use(
    new LocalStrategy({ usernameField: "username" }, (username, password, done) => {
        User.findOne({ username:username })
            .then(user => {
                if (!user) {
					return done(null,false,{message: "Invalid Username"});
                } else {
                    // Comparar contraseña
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: "Wrong password" });
                        }
                    });
                }
            })
            // Error
            .catch(err => {
                return done(null, false, { message: err });
            });
    })
);

//Exportando modulo passport
module.exports = passport;
