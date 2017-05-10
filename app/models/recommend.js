var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var recommendSchema = mongoose.Schema({

  // currently only care about local
  recommendedTitles : {
    _id             : ObjectId,
    owner           : String,
    lastUpdated     : String, 
    recBooks        : {
      _id           : ObjectId,
      title         : String,
      publisher     : String,
      ongoing       : Boolean,
      writer        : String,
      artist        : String
    }
  }
}, {strict: false});

//create the model for collections and expose it to our app
module.exports = mongoose.model('recommendedTitles', recommendSchema);
