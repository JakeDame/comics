//Set up all packages and tools needed
//====================================
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var configDB = require('./config/database.js');

var app = express();


//configuration
mongoose.Promise = global.Promise;
var db = mongoose.connect(configDB.url);

// Get the collection data from Mongodb
var Schema = mongoose.Schema;
var comicData = mongoose.model('ComicBook', 
                new Schema({ Title: String, Folder: String, ReleaseDate: String, Publisher: String, Cover: String }), 
                'comicBooks');

var recommendedData = mongoose.model('recommendedTitle', 
                      new Schema({ owner: String, lastUpdated: String,
                      books : { title: String, publisher: String, 
                                ongoing: Boolean, writer: String, 
                                artist: String} }), 'recommended');

require('./config/passport')(passport); //pass passport for configuration

// set up express app
app.use(morgan('dev')); // log every request to console
app.use(cookieParser()); // read cookies
app.use(bodyParser.urlencoded({ extended: true })); /// get information from html forms
app.use(bodyParser.json()); /// get information from html forms

app.set('port', process.env.PORT || 3000); //set port and default port
app.set('view engine', 'ejs');
app.set('views', __dirname + '/../app/views');

//Used to give data to views and routes
app.set('comicData', comicData);
app.set('recommendedData', recommendedData);
//app.set('collectionData', collectionData);

//required for passport
app.use(session({ secret: 'shenanigans',
                  resave: true,
                  saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); //use connect-flash for flash messages stored in session

app.use(express.static(__dirname + '/../app/public'));

//routes
require('./routes.js')(app, passport); 

// server
var server = app.listen(app.get('port'), function() {
  console.log('Listening on port ' + app.get('port'));
});

