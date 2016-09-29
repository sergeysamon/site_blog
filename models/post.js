var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var User     = require('./user');
var tr       = require('transliteration').transliterate;
var slug     = require('slugify');
// var mongoosePaginate = require('mongoose-paginate');


function getTags(tags) {
    return tags.join(', ');
}
function setTags(tags) {
    // return tags.split(',').map(function (val) {
    //     return val.trim();
    // });

    return tags.split(', ');
}


function toSlug(str) {
    return slug(tr(str)).toLowerCase().replace(/[/.,!?;:]*/g, '');
}

var PostSchema = new Schema({
    title    : {type: String, default: '', trim: true},
    text     : {type: String, default: '', trim: true},
    slug     : {type: String},
    comments : [{
        user     : {type: String},
        email    : {type: String},
        text     : {type: String},
        createdAt: {type: Date, default: Date.now}
    }],
    // author     : {type: Schema.Types.ObjectId, ref: 'User'},
    author   : String,
    // comments : [{
    //     body     : {type: String, default: ''},
    //     user     : {type: Schema.ObjectId, ref: 'User'},
    //     createdAt: {type: Date, default: Date.now}
    // }],
    likes    : [{
        id_users: {type: String}
    }],
    tags     : {type: String, get: getTags, set: setTags},
    createdAt: {type: Date, default: Date.now}
});

// PostSchema.plugin(mongoosePaginate);

PostSchema.pre('save', function (next) {
    console.log(this.author);
    // User.findById(this.author)
    this.slug = toSlug(this.title);
    next();
});

module.exports = mongoose.model('Post', PostSchema);
