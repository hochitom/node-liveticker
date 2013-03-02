var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Ticker = new Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    type: {type: String, required: true},
    description: { type: String },
    team1: { type: String },
    team2: { type: String },
    place: {type: String},
    visitors: {type: Number},
    officials: {
        first: {type: String},
        second: {type: String},
        third: {type: String},
        fourth: {type: String}
    }
});

module.exports = mongoose.model('Tickers', Ticker);