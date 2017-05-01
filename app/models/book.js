var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
  Book        : {
    title     : String,
    issue     : Number,
    publisher : String,
    ongoing   : Boolean,
    writer    : String,
    artist    : String
  }
});

module.exports = bookSchema;
