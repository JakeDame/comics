module.exports = function(app, passport) {

  //Get this week's wednesday for query
  //Probably bad form, but I just need my data
  var ReleaseDate;
  var exec = require("child_process").exec, child;
    
  child = exec("python3 thisWeek.py", 
    function(error, stdout, stderr) {
      ReleaseDate = stdout;
      ReleaseDate = ReleaseDate.substring(0,ReleaseDate.length-1);
    });


  /////////////
  //Home Page//
  /////////////
  app.get('/', function(req, res) {

    // Variable setup and data fetching
    var data = req.app.get('comicData');
    var userData = require('./models/collection.js');
    var recData = require('./models/recommend.js');
    var users = require('./models/user.js');
    var pagePhotos = [];
    var comicTitles = [];

    // Data necessary for Logged in index view
    var userTitles = [];
    var userArray = [];
    var pubArray = [];
    var userPubArray = [];

    // Function to get collection data based on user
    var getUserTitles = function(username, callback) {
      userData.findOne({"owner":username}).lean().exec(function(err, coll) {
        callback(err, coll);
      });
    };

    // Get this weeks releases
    data.find({'ReleaseDate': ReleaseDate}, function(err,data) {
      for(var i = 0; i < data.length; i++){
        pagePhotos=pagePhotos.concat(data[i].Folder + '/' + data[i].Cover);
        comicTitles = comicTitles.concat(data[i].Title);
      }

      if(req.user){

        // Fill userArray
        users.find().exec(function(err, data) {
          for(var i = 0; i < data.length; i++) {
            userArray.push(data[i].local.username);
          }
          //console.log("users: " + userArray.length);
        });


        // Use data returned from function to fill userTitles array
        getUserTitles(req.user.local.username, function(err, coll) {
          if(err) res.status(500).send(err);

          for(var i = 0; i < coll.books.length; i++) {
            userTitles = userTitles.concat(coll.books[i].title);
            if(!pubArray.includes(coll.books[i].publisher))
              pubArray.push(coll.books[i].publisher);
          }

          // Render logged in index page
          res.render('indexLI', {
            pageTitle    : 'Home - logged in',
            coverArt     : pagePhotos,
            title        : comicTitles,
            userTitle    : userTitles,
            releaseDate  : ReleaseDate,
            user         : req.user,
            pageID       : 'home'
          });
        });
      } else {
      // Render non logged in index page
      res.render('index', {
        pageTitle    : 'Home',
        coverArt     : pagePhotos,
        title        : comicTitles,
        releaseDate  : ReleaseDate,
        pageID       : 'home'
      });
      }
    });
  });

  ///////////
  // Login //
  ///////////
  app.get('/login', function(req, res) {
    res.render('login.ejs', {message: req.flash('loginMessage') });
  });

  //process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', 
    failureRedirect : '/login',
    failureFlash : true
  }));


  ////////////
  // Signup //
  ////////////
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  /////////////////////////////
  // process the signup form //
  /////////////////////////////
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', 
    failureRedirect : '/signup',
    failureFlash : true
  }));


  /////////////
  // Profile //
  /////////////
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  });

  ////////////
  // Logout //
  ////////////
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  ////////////////////////////
  // Gather Collection Data //
  ////////////////////////////
  app.get('/collection', function(req, res) {
    var collection = require('./models/collection.js');
    collection.find({"owner" : req.user.local.username})
    .exec(function(err, coll){
      if(err) res.status(500).send(err);

      //console.log(coll);
      res.json(coll);
    });
  });

  /////////////////////////
  // Get Recommendations //
  /////////////////////////
  app.get('/recommendations', function(req, res) {
    //var collection = require('./models/recommend.js');
    var data = req.app.get('recommendedData');
    data.find({"owner" : req.user.local.username})
    .exec(function(err, coll){
      if(err) res.status(500).send(err);

      //console.log(coll);
      res.json(coll);
    });
  });

  
  ////////////////////////////
  // Add book to Collection //
  ////////////////////////////
  app.post('/collection', function(req, res) {
    // Get collection model
    var collection = require('./models/collection.js');
    var query = { "owner" : req.user.local.username };
    // Get form values
    var title = req.body.title;
    var issueB = req.body.issueB;
    var issueE = req.body.issueE;
    var publisher = req.body.publisher;
    var ongoing = req.body.ongoing;
    var writer = req.body.writer;
    var artist = req.body.artist;

    /* Output for Debug 
    console.log('owner: ' + req.user.local.username);
    console.log('title: ' + title);
    console.log('issueB: ' + issueB);
    console.log('issueE: ' + issueE);
    console.log('publisher: ' + publisher);
    console.log('ongoing: ' + ongoing);
    console.log('writer: ' + writer);
    console.log('artist: ' + artist);
    */
    var issues;
    if( issueB == issueE || issueE == 0) {
      issues = "" + issueB;
    }
    else {
      issues = "" + issueB + '-' + issueE;
    }



    // Update collection with new books
    collection.update( query , 
                     { $push   : {  
                       "books" : {
                         "title"     : title,
                         "issue"     : issues,
                         "publisher" : publisher,
                         "ongoing"   : ongoing,
                         "writer"    : writer,
                         "artist"    : artist 
                        } } }, {upsert:true}, 
      function (err, upd) {
        if(err) res.status(500).send(err);

        //console.log(upd);
        res.render('profile.ejs', {
          user : req.user // get the user out of session and pass to template
        });
    });

  });


  //////////////////////////////////
  // Remove Entry from Collection //
  //////////////////////////////////
  app.delete('/deleteEntry/:title', function(req, res) {
    var collection = require('./models/collection.js');
    var titleToDelete  = req.params.title;
    var query = { "owner" : req.user.local.username };
    collection.update( query, { $pull   : { 
                                "books" : { 
                                  "title" : titleToDelete} } },
      function(err, upd) {
        if(err) res.status(500).send(err);

        res.render('profile.ejs', {
          user : req.user 
        });
      });
  });

};

function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}
