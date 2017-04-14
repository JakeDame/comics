module.exports = function(app, passport) {
  app.get('/', function(req, res) {
    var data = req.app.get('comicData');
    var pagePhotos = [];
    var comicTitles = [];

    data.comics.forEach(function(item) {
      pagePhotos = pagePhotos.concat(item.folder + '/' + item.Cover);
      comicTitles = comicTitles.concat(item.Title);
    });

    res.render('index', {
      pageTitle: 'Home',
      coverArt: pagePhotos,
      title: comicTitles,
      pageID: 'home'
    });
  });

};
