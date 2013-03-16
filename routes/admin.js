var express = require('express'),
    crypto = require('crypto'),
    Ticker = require('../models/ticker'),
    Event = require('../models/event'),
    User = require('../models/user'),
    mapper = require('../lib/model-mapper');

function checkAuth (req, res, next) {
    if (!req.session.user_id) {
        res.redirect('/admin/login');
    } else {
        next();
    }
}

function encryptPassword (password) {
    var md5sum = crypto.createHash('md5'),
        salt = 'adAsöfbaNbalj§sdha!3971236',
        s = salt+password;

    md5sum.update(s);

    return(md5sum.digest('hex'));
};

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

    app.get('/admin', function(req, res) {
        if (!req.session.user_id) {
            res.redirect('/admin/login');
        } else {
            res.redirect('/admin/tickers');
        }
    });

    app.get('/admin/login', function(req,res) {
        res.render('admin/login/login');
    });

    app.get('/admin/register', function(req,res) {
        res.render('admin/login/register');
    });

    app.post('/admin/register', function(req, res) {
        if (req.param('password') === req.param('password2')) {

            req.body.password = encryptPassword(req.body.password);

            var user = new User(req.body);
            user.save(function(err) {
                if (err) {
                    res.redirect('/admin/register');
                } else {
                    res.redirect('/admin/login');
                }
            });
        } else {
            res.redirect('/admin/register');
        }
    });

    app.post('/admin/login', function(req, res) {
        User.findOne({user: req.param('user')}, function(e, o) {
            if (!o) {
                res.redirect('/admin/login');
            } else {
                if (encryptPassword(req.param('password')) === o.password) {

                    req.session.user_id = o._id;

                    if (req.param('remember') == 'true'){
                        res.cookie('user', req.param('user'), { maxAge: 900000 });
                        res.cookie('pass', req.param('password'), { maxAge: 900000 });
                    }

                    res.redirect('/admin/tickers');
                }
            }
        });
    });
    
    app.get('/admin/logout', function(req, res) {
        delete req.session.user_id;
        res.redirect('/admin/login');
    });

    app.get('/admin/tickers', checkAuth, function(req, res) {
        var now = new Date();
        Ticker.find({})
            .where('date')
            .gt(now)
            .exec(function(err, tickers) {
                Ticker
                    .find({})
                    .where('date')
                    .lt(now)
                    .exec(function(err, finishedtickers) {
                        res.render('admin/tickers/index', {
                            finishedtickers : finishedtickers,
                            tickers : tickers
                        });
                    });
            });
    });

    app.get('/admin/tickers/create', checkAuth, function(req, res) {
        res.render('admin/tickers/create', { ticker : new Ticker() });
    });

    app.post('/admin/tickers/create', function(req, res) { 
        var ticker = new Ticker(req.body);

        ticker.save(function(err) {
            if (err) {
                res.render('admin/tickers/create', {
                    ticker : ticker
                });
            } else {
                res.redirect('/admin/tickers');
            }
        });
    });

    app.get('/admin/tickers/:tickerId/edit', checkAuth, function(req, res) {
        res.render('admin/tickers/edit');
    });

    app.post('/admin/tickers/:tickerId/edit', function(req, res) {
        var ticker = res.locals.ticker;
        mapper.map(req.body).to(ticker);

        ticker.save(function(err) {
            if (err) {
                res.render('admin/tickers/edit', {
                    ticker : ticker
                });
            } else {
                res.redirect('/admin/tickers');
            }
        });
    });

    app.get('/admin/tickers/:tickerId/detail', checkAuth, function(req, res) {
        var ticker = res.locals.ticker;

        /*app.io.sockets.on('connection', function (socket) {
            console.log("Connection " + socket.id + " accepted.");
        });*/

        Event
            .find({ticker: ticker._id})
            .sort('-date')
            .exec(function(err, events) {
                res.render('admin/tickers/detail', { 
                    event: new Event(),
                    events: events
                });
            });
    });

    app.post('/admin/tickers/:tickerId/detail', function(req, res) {
        var ticker = res.locals.ticker;
        var tickerId = ticker._id;
        var event = new Event({
            ticker: tickerId,
            text: req.body.message,
            type: req.body.type,
            headline: req.body.headline,
            team: req.body.team,
            minute: req.body.minute
        });

        event.save(function(err){
            if (err) {
                console.log('error');
            } else {

                app.io.sockets.on('connection', function (socket) {
                    socket.broadcast.emit('newMessage', event);
                });

                res.redirect('/admin/tickers/' + tickerId + '/detail');
            }
        });
    });

    app.get('/admin/tickers/:tickerId/delete', checkAuth, function(req, res) {
        res.render('admin/tickers/delete');
    });

    app.post('/admin/tickers/:tickerId/delete', function(req, res) {
        Event.remove({ticker: req.params.tickerId}, function(err) {
            Ticker.remove({ _id : req.params.tickerId }, function(err) {
                res.redirect('/admin/tickers');
            });
        });
    });
}
