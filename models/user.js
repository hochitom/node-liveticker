var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = new Schema({
    user: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    lastlogin: { type: Date, default: Date.now },
    userSalt: {type: String }
});

module.exports = mongoose.model('User', User);