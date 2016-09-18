 var express = require('express');

var routes = function(Reading) {
    'use strict';

    var router = express.Router();

    router.all('/*', function (req, res, next) {
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('Client IP:', ip);
        //CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
        //Custom CORS headers
        res.setHeader('Access-Control-Allow-Headers',
        'Cookie, Content-type, Accept, X-Requested-With, X-Access-Token, X-Key');
        res.setHeader('Last-Modified', (new Date()).toUTCString());
        next();
    });

    // middleware to use for all requests
    router.use(function(req, res, next) {
        // do logging
        console.log('Processing request');
        next(); // make sure we go to the next routes and don't stop here
    });

    router.use(function(req, res, next){
        if (req.is('text/*')) {
            req.text = '';
            req.setEncoding('utf8');
            req.on('data', function(chunk) {
              req.text += chunk;
            });
            req.on('end', next);
        } else {
            next();
        }
    });

    router.route('/readings')
        .get(function(req, res) {
            Reading.find({ $query: {}, $orderby: { '_id' : 1 } }).exec(function(err, readings) {
                if (err) {
                  res.send(err);
                }
                res.json(readings);
            });
        });

    router.route('/reading') //current reading
        .get(function(req, res) {
            Reading.findOne( {$query:{}, $orderby: { $natural : -1 } }, function(err, reading) {
                if(err) {
                  res.send(err);
                }
                res.json(reading);
            });
        })
        .post(function(req, res) {
            var reading = new Reading();
            reading.reading = req.text;
            reading.created_at = new Date();
            // save the bear and check for errors
            reading.save(function(err) {
                if (err) {
                  res.send(err);
                }
                res.json({ message: 'Reading saved!' });
            });
        });

    router.route('/readings/dates/')
        .get(function(req, res) {
            var start = new Date(req.query.start * 1000);
            var end;
            end = req.query.end !== '' ?
              new Date(req.query.end * 1000) :
              end = new Date(2147483648 * 1000);

            console.log(start + ' || ' + end);

            Reading.find()
            .where('created_at')
            .gte(start)
            .lte(end)
            .exec(function(err, readings) {
                if (err) {
                    res.send(err);
                }
                res.json(readings);
            });
        });

    router.get('*', function (req, res) {
        res.sendfile('index.html');
    });

    return router;
};

module.exports = routes;
