'use strict';

module.exports = function(environment) {

    var mongoose = require('mongoose');
    var config = require('../config/config')(environment);

    mongoose.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/' + config.mongo.db);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error: '));
    db.once('open', function () {
        console.log('Database connection opened at: ' + config.mongo.db);
    });

    // When the connection is disconnected
    db.on('disconnected', function () {
        console.log('Mongoose connection disconnected');
    });

    var Schema = mongoose.Schema;

    var ReadingSchema = new Schema({
        reading: { type: Number, required: true },
        created_at: { type: Date, required: true }
    });

    return mongoose.model('Reading', ReadingSchema);

};
