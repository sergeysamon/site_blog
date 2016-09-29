var express       = require('express');
var path          = require('path');
var favicon       = require('serve-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var nunjucks      = require('nunjucks');
var mongoose      = require('mongoose');
// var paginate      = require('express-paginate');
var passport      = require('passport');
// var LocalStrategy = require('passport-local').Strategy;
var session       = require('express-session');
var flash         = require('connect-flash');

//connect to db.
mongoose.connect(require('./config/config').db_mLab, function (err) {
    if (err) console.log(err);
    else console.log('=== Connect to db ===');
});

//init app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'nunj');
app.set('view cache', false);

// add filters tp nunjucks
var dateFilter = require('nunjucks-date-filter');
nunjucks.configure(app.get('views'), {
    autoescape: true,
    noCache   : true,
    watch     : true,
    express   : app
})
    .addFilter('formatDate', dateFilter);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('node-sass-middleware')({
    src        : path.join(__dirname, 'public'),
    dest       : path.join(__dirname, 'public')
    // outputStyle: 'compressed',
    // indentedSyntax: true,
    // sourceMap  : true
}));
app.use(require('express-session')({
    secret           : require('./config/config').secretKey,
    resave           : false,
    saveUninitialized: false
}));

// required for passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./config/passport')(passport);

app.use(function (req, res, next) {
    res.locals.isAuth = req.isAuthenticated();
    next();
});

//add routes
var routes = require('./routes/index');
var users  = require('./routes/users');
var auth   = require('./routes/auth');

app.use('/', routes);
app.use('/users', users);
app.use('/', auth);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err    = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error  : err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error  : {}
    });
});


module.exports = app;
