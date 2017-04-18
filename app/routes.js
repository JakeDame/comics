module.exports = function(app, passport) {

  //Home Page
  app.get('/', function(req, res) {
    //Data now in database, not json file, NEED to fix after users
    var data = req.app.get('comicData');
    var pagePhotos = [];
    var comicTitles = [];

    /*
    data.comics.forEach(function(item) {
      pagePhotos = pagePhotos.concat(item.folder + '/' + item.Cover);
      comicTitles = comicTitles.concat(item.Title);
    });
    */

    res.render('index', {
      pageTitle: 'Home',
      coverArt: pagePhotos,
      title: comicTitles,
      pageID: 'home'
    });
  });

  // Login
  app.get('/login', function(req, res) {
    res.render('login.ejs', {message: req.flash('loginMessage') });
  });

  //process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', 
    failureRedirect : '/login',
    failureFlash : true
  }));

  // Signup
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  //process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', 
    failureRedirect : '/signup',
    failureFlash : true
  }));

  //Profile
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  });

  //Logout
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

};

function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}
