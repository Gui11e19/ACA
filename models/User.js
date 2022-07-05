const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
		unique: true
    },
    password: {
        type: String,
        required: true
    }
});
UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
        return next(err);
        }
            user.password = hash;
        
        next();
    });
    });
module.exports = mongoose.model('user', UserSchema);
