// require express
var express = require("express");
// path module -- try to figure out where and why we use this
var path = require("path");
// create the express app
var app = express();
// require body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
        extended: false,
     parameterLimit: 10000,
     limit: 1024 * 1024 * 10
}));
app.use(bodyParser.json({
        extended: false,
     parameterLimit: 10000,
     limit: 1024 * 1024 * 10
}));

// static content
app.use(express.static(path.join(__dirname, "./client")));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// This goes in our server.js file so that we actually use the mongoose config file!
require('./config/mongoose.js');

// this line requires and runs the code from our routes.js file and passes it app so that we can attach our routing rules to our express application!
require('./config/routes.js')(app);

// tell the express app to listen on port 8000
var server = app.listen(8000, function() {
    console.log('\n*******************************************************************');
    console.log('*****                                                         *****');
    console.log('*****                 Listening on port 8000                  *****');
    console.log('*****                                                         *****');
    console.log('*******************************************************************\n');
})
