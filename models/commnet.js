var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var User     = require('./user');


var CommentSchema = new Schema({
    user     : {type: String},
    email    : {type: String},
    text     : {type: String},
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Comment', CommentSchema);