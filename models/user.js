var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');


var UserSchema = new Schema({
    email   : {type: String, require: true},
    username: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    posts   : [{
        type: Schema.Types.ObjectId,
        ref : 'Post'
    }]
});

UserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.pre('save', function (next) {
    var user = this;

    console.log(user.username);
    console.log(user.email);
    console.log(user.password);
    next();
});


module.exports = mongoose.model('User', UserSchema);
