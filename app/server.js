var express = require('express');
var app = express();
var comicData = require('./data/comicData.json');

app.set('port', process.env.PORT || 3000);
app.set('comicData', comicData);
app.set('view engine', 'ejs');
app.set('views', 'app/views');


app.use(express.static('app/public'));
app.use(require('./routes/index'));

var server = app.listen(app.get('port'), function() {
  console.log('Listening on port ' + app.get('port'));
});
