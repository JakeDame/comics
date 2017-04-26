var mongoose = require('mongoose');

var collectionSchema = mongoose.Schema({

  // currently only care about local
  collections    : {
    books       : {
      title     : String,
      issue     : Number,
      publisher : String,
      ongoing   : Boolean,
      writer    : String,
      Artist    : String,
      owner     : String
    }
  }

});

//create the model for collections and expose it to our app
module.exports = mongoose.model('collections', collectionSchema);
