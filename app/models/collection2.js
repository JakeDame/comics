var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bookSchema = require('./book.js').bookSchema;

var collectionSchema = new Schema({
  Collection    : {
    owner       : String,
    Books       : bookSchema
  }
});

//create the model for collections and expose it to our app
module.exports = { model: mongoose.model('Collections', collectionSchema) };
