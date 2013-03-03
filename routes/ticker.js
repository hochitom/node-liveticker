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
    
    app.get('/admin/tickers', function(req, res) {
        Ticker.find({}, function(err, tickers) {
            res.render('admin/index', { tickers : tickers });
        });
    });

    app.get('/admin/tickers/create', function(req, res) {
        res.render('admin/create', { ticker : new Ticker() });
    });

    app.post('/admin/tickers/create', function(req, res) { 
        var ticker = new Ticker(req.body);

        ticker.save(function(err) {
            if (err) {
                res.render('admin/create', {
                    ticker : ticker
                });
            } else {
                res.redirect('/admin/tickers');
            }
        });
    });

    app.get('/admin/tickers/:tickerId/edit', function(req, res) {
        res.render('admin/edit');
    });

    app.post('/admin/tickers/:tickerId/detail', function(req, res) {
        var ticker = res.locals.ticker;
        var tickerId = ticker._id;
        var event = new Event({
            ticker: tickerId,
            text: req.body.message,
            type: req.body.type
        });

        event.save(function(err){
            if (err) {
                console.log('error');
            } else {
                console.log('success');

                app.io.sockets.on('connection', function (socket) {
                    socket.broadcast.emit('newMessage', event);
                });

                res.redirect('/admin/tickers/' + tickerId + '/detail');
            }
        });
    });

    app.post('/admin/tickers/:tickerId/edit', function(req, res) {
        var ticker = res.locals.ticker;
        mapper.map(req.body).to(ticker);

        ticker.save(function(err) {
            if (err) {
                res.render('admin/edit', {
                    ticker : ticker
                });
            } else {
                res.redirect('/tickers');
            }
        });
    });

    app.get('/admin/tickers/:tickerId/detail', function(req, res) {
        var ticker = res.locals.ticker;

        app.io.sockets.on('connection', function (socket) {
            console.log("Connection " + socket.id + " accepted.");

            socket.on('message', function(message){
                console.log("Received message: " + message + " - from client " + socket.id);

                var event = new Event({
                    text: message
                });

                console.log(event);

                event.save(function (err) {
                    console.log('test');
                    if (err) console.log('new entry failed');
                    
                    console.log('entry saved!');
                    socket.broadcast.emit('publish', message);
                });
            });
        });

        Event.find({ticker: ticker._id}, function(err, events) {
            res.render('admin/detail', { 
                event: new Event(),
                events: events
            });
        });
    });

    app.get('/admin/tickers/:tickerId/delete', function(req, res) {
        res.render('admin/delete');
    });

    app.post('/admin/tickers/:tickerId/delete', function(req, res) {
        Ticker.remove({ _id : req.params.tickerId }, function(err) {
            res.redirect('/tickers');
        });
    });
}
