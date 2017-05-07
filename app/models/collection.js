// Potential Changes: 
// - Adding a year category for book relevance

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var collectionSchema = mongoose.Schema({

  // currently only care about local
  collections   : {
    _id         : ObjectId,
    owner       : String,
    books       : {
      _id       : ObjectId,
      title     : String,
      issue     : String,
      publisher : String,
      ongoing   : Boolean,
      writer    : String,
      artist    : String
    }
  }
}, {strict: false});

//create the model for collections and expose it to our app
module.exports = mongoose.model('collections', collectionSchema);
