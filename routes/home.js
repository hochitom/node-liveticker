var express = require('express'),
    Ticker = require('../models/ticker'),
    Event = require('../models/event'),
    mapper = require('../lib/model-mapper');

module.exports = function(app) {

    app.param('tickerId', function(req, res, next, id) {
        Ticker.findOne({ _id : id }, function(err, ticker) {
            if (err) {
                next(err);
            } else {
                res.locals.ticker = ticker;
                next();
            }
        });
    });
    
    app.get('/', function(req, res) {
        Ticker.find({}, function(err, tickers) {
            res.render('ticker/index', { tickers : tickers });
        });
    });

    app.get('/ticker/:tickerId', function(req, res) {
        var ticker = res.locals.ticker;
        Event.find({ticker: ticker._id}, function(err, events) {
            res.render('ticker/detail', { 
                event: new Event(),
                events: events
            });
        });
    });
}
