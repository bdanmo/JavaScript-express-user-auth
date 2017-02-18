const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    favoriteBook: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    }
}); //end of Schema constructor

//authenticate input against database documents
UserSchema.statics.authenticate = function (email, password, callback) {
    User.findOne( { email: email } )
        .exec( (err, user) => { //when findOne has found one (or not), execute this function.
            if (err) return callback(err); //if there is an error with the query operation itself
            else if (!user) {
                return callback();
            }
            bcrypt.compare(password, user.password, (err, result) => {
                if (result === true) return callback(null, user);
                return callback();
            })
        });
}

//hash user password
UserSchema.pre('save', function(next) {
  user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) next(err);
    user.password = hash;
    next();
  })
});

const User = mongoose.model('User', UserSchema); //the actual creation of a collection in mongoDB called "User", patterned after the userSchema object
module.exports = User;
