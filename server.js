'use strict';
// BASE SETUP
// =============================================================================

// call the packages we need
let express = require('express');           // call express
let app = express();                        // define our app using express
let bodyParser = require('body-parser');
let path = require('path');

let config = require('./config/config.js')('local');

let port = process.env.PORT || config.port;        // set our port
let environment = process.env.NODE_ENV;

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let Reading = require('./models/reading')('local');
let routes = require('./routes/routes.js')(Reading);

switch (environment) {
    case 'build':
      console.log('** BUILD **');
      app.use(express.static('./build/'));
      app.use('/*', express.static('./build/index.html'));
      break;
    default:
        console.log('** DEV **');
        app.use(express.static(path.join(__dirname, '/public')));
        app.use('/public', express.static(path.join(__dirname, '/public')));
        app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));
        app.use('/.tmp', express.static(path.join(__dirname, '/.tmp')));
        break;
}

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
console.log('NODE_ENV=' + environment);
app.use('/', routes);
