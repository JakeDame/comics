var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var recommendedSchema = mongoose.Schema({

  // currently only care about local
  recommended       : {
    _id             : ObjectId,
    owner           : String,
    lastUpdated     : String, 
    books           : {
      title         : String,
      publisher     : String,
      ongoing       : Boolean,
      writer        : String,
      artist        : String
    }
  }
}, {strict: false});

//create the model for collections and expose it to our app
module.exports = mongoose.model('recommended', recommendedSchema);
