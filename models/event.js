var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Event = new Schema({
    ticker: { type: String},
    text: { type: String },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Events', Event);