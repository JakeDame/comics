module.exports = function(app, passport) {

  //Home Page
  app.get('/', function(req, res) {
    //Data now in database, not json file, NEED to fix after users
    /*
    var data = req.app.get('comicData');
    var pagePhotos = [];
    var comicTitles = [];

    data.comics.forEach(function(item) {
      pagePhotos = pagePhotos.concat(item.folder + '/' + item.Cover);
      comicTitles = comicTitles.concat(item.Title);
    });
    */

    res.render('index', {
      pageTitle: 'Home',
      //coverArt: pagePhotos,
      //title: comicTitles,
      pageID: 'home'
    });
  });

  //Login
  app.get('/login', function(req, res) {
    res.render('login.ejs', {message: req.flash('loginMessage') });
  });

  //process the login form
  // app.post('/login', do passport stuff);


};
