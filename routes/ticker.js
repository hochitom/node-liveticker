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
    
    app.get('/tickers', function(req, res) {
        Ticker.find({}, function(err, tickers) {
            res.render('ticker/index', { tickers : tickers });
        });
    });

    app.get('/tickers/create', function(req, res) {
        res.render('ticker/create', { ticker : new Ticker() });
    });

    app.post('/tickers/create', function(req, res) { 
        var ticker = new Ticker(req.body);

        ticker.save(function(err) {
            if (err) {
                res.render('ticker/create', {
                    ticker : ticker
                });
            } else {
                res.redirect('/tickers');
            }
        });
    });

    app.get('/tickers/:tickerId/edit', function(req, res) {
        res.render('ticker/edit');
    });

    app.post('/tickers/:tickerId/detail', function(req, res) {
        var ticker = res.locals.ticker;
        var tickerId = ticker._id;
        var event = new Event({
            ticker: tickerId,
            text: req.body.message
        });

        event.save(function(err){
            if (err) {
                console.log('error');
            } else {
                console.log('success');
                res.redirect('/tickers/' + tickerId + '/detail');
            }
        });
    });

    app.post('/tickers/:tickerId/edit', function(req, res) {
        var ticker = res.locals.ticker;
        mapper.map(req.body).to(ticker);

        ticker.save(function(err) {
            if (err) {
                res.render('ticker/edit', {
                    ticker : ticker
                });
            } else {
                res.redirect('/tickers');
            }
        });
    });

    app.get('/tickers/:tickerId/detail', function(req, res) {
        var ticker = res.locals.ticker;
        Event.find({ticker: ticker._id}, function(err, events) {
            res.render('ticker/detail', { 
                event: new Event(),
                events: events
            });
        });
    });

    app.get('/tickers/:tickerId/delete', function(req, res) {
        res.render('ticker/delete');
    });

    app.post('/tickers/:tickerId/delete', function(req, res) {
        Ticker.remove({ _id : req.params.tickerId }, function(err) {
            res.redirect('/tickers');
        });
    });
}
