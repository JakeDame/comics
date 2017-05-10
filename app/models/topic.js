var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var topicSchema = mongoose.Schema({

  // currently only care about local
  topic         : {
    _id         : ObjectId,
    title       : String,
    body        : String,
    author      : String,
    posted      : Date,
    comments    : {
      _id       : ObjectId,
      body      : String,
      author    : String,
      posted    : Date
    }
  }
}, {strict: false});

//create the model for collections and expose it to our app
module.exports = mongoose.model('topic', topicSchema);
