var express        = require('express');
var router         = express.Router();
var Post           = require('../models/post');
var _              = require('lodash');
var paginate       = require('express-paginate');
var isLoggedIn     = require('../helpers').isLoggedIn;
var searchInArrObj = require('../helpers').searchInArrObj;


/* GET home page. */
router.get('/', function (req, res, next) {
    Post.find({}, function (err, posts) {
        if (err)
            res.render('error', {status: 500});
        else {
            res.render('pages/home', {posts: posts});
        }
    });
});


router.get('/post/:slug', function (req, res, next) {
    Post.findOne({slug: req.params.slug}, function (err, post) {
        if (err)
            res.render('error', {status: 500});
        else {
            res.render('pages/postDetail', {
                post: post
            })
        }
    });
});

router.post('/post/:slug', function (req, res) {
    Post.findOne({slug: req.params.slug}, function (err, post) {
        if (err) console.log(err);
        post.comments.push({
            user : req.body.user,
            email: req.body.email,
            text : req.body.text
        });
        post.save(function (err, updatePost) {
            if (err) console.log(err);
            res.redirect('/post/' + req.params.slug);
        })
    })
});

router.get('/new/post', isLoggedIn, function (req, res, next) {
    res.render('pages/newPost', {});
});

router.post('/new/post', function (req, res, next) {
    var post    = new Post();
    post.title  = req.body.title;
    post.text   = req.body.text;
    post.author = req.user._id;

    post.save(function (err, post) {
        if (err) {
            res.send(err)
        }
    });
    res.redirect('/');
});


router.post('/likes-post', function (req, res) {
    if (req.isAuthenticated()) {
        Post.findOne({slug: req.body.slug}, function (err, post) {
            if (err) console.log(err);

            if (!searchInArrObj(post.likes, req.user.username)) {
                post.likes.push({
                    id_users: req.user.username
                });
                post.save(function (err, post) {
                    if (err) console.log(err);
                    res.json({
                        likes: post.likes.length
                    });
                })
            }
            else {
                res.json({
                    message: 'likes is exist'
                });
            }
        });
    } else {
        res.json({
            message: 'isAuthenticated: false'
        });
    }
});


module.exports = router;
