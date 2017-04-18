//Set up all packages and tools needed
//====================================
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');


//configuration
mongoose.connect(configDB.url);

// Get the collection data from Mongodb
// collection vars: Title, Publisher, ReleaseDate, Folder, Cover
var Schema = mongoose.Schema;
var comicData = mongoose.model('ComicBook', 
                new Schema({ Title: String, Folder: String, ReleaseDate: String, Publisher: String, Cover: String }), 
                'comicBooks');

//Test to make sure data is grabbed
//comicData.find({}, function(err, data) { console.log(err, data, data.length); });

require('./config/passport')(passport); //pass passport for configuration

// set up express app
app.use(morgan('dev')); // log every request to console
app.use(cookieParser()); // read cookies
app.use(bodyParser()); /// get information from html forms

app.set('port', process.env.PORT || 3000); //set port and default port
app.set('view engine', 'ejs');
app.set('views', 'app/views');

//Used to give data to views and routes, no longer used
//app.set('comicData', comicData);

//required for passport
app.use(session({ secret: 'shenanigans' }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); //use connect-flash for flash messages stored in session


app.use(express.static('app/public'));

//routes
require('./routes.js')(app, passport); 

// server
var server = app.listen(app.get('port'), function() {
  console.log('Listening on port ' + app.get('port'));
});
