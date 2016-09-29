var express       = require('express');
var router        = express.Router();
var User          = require('../models/user');
var passport      = require('passport');
var isLoggedIn    = require('../helpers').isLoggedIn;
var isNotLoggedIn = require('../helpers').isNotLoggedIn;
var _             = require('lodash');



router.get('/login', isNotLoggedIn, function (req, res) {
    res.render('pages/login', {message: req.flash('loginMessage')});
});

router.post('/login',
    passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash   : true // allow flash messages
    }));

router.get('/signup', isNotLoggedIn, function (req, res) {
    res.render('pages/signup', {message: req.flash('signupMessage')});
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash   : true // allow flash messages
}));

router.get('/profile', isLoggedIn, function (req, res) {
    res.render('pages/profile', {
        user: req.user
    });
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;