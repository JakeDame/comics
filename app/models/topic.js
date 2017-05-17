var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var topicSchema = mongoose.Schema({

  topic             : {
    _id             : ObjectId,
    postTitle       : String,
    postBody        : String,
    postAuthor      : String,
    postPosted      : Date,
    comments        : {
      _id           : ObjectId,
      commentBody   : String,
      commentAuthor : String,
      commentPosted : Date
    }
  }
}, {strict: false});

//create the model for collections and expose it to our app
module.exports = mongoose.model('topic', topicSchema);
