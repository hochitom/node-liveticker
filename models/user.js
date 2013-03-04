var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var User = new Schema({
    user: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    lastlogin: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model('User', User);