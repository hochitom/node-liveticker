var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Ticker = new Schema({
    name: { type: String },
    date: { type: Date },
    description: { type: String }
});

module.exports = mongoose.model('Tickers', Ticker);