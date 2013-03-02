var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Event = new Schema({
    ticker: { type: String},
    text: { type: String, required: true },
    date: { type: Date, default: Date.now },
    type: { type: String }
});

module.exports = mongoose.model('Events', Event);