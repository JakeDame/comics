var mongoose = require('mongoose');

var collectionSchema = mongoose.Schema({

  // currently only care about local
  collection    : {
    book        : {
      title     : String,
      issue     : int,
      publisher : String,
      ongoing   : Boolean,
      writer    : String,
      Artist    : String,
      owner     : String
    }
  }

});

//create the model for collections and expose it to our app
module.exports = mongoose.model('Collection', collectionSchema);
