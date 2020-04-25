var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');


var routes = require('./routes/login');
var maps = require('./routes/maps');
var profile = require('./routes/profile');
var setup = require('./routes/setup');
var users = require('./routes/users');
var register = require('./routes/register');
var customerlist = require('./routes/customerlist');
var customerdetail = require('./routes/customerdetail');
var customeredit = require('./routes/customeredit');
var createmaster = require('./routes/createmaster');
var createcarbrand = require('./routes/createcarbrand');
var master = require('./routes/master');
var carbrand = require('./routes/carbrand');
var product = require('./routes/product');
var createproduct = require('./routes/createproduct');
var waranty = require('./routes/waranty');
var checkwaranty = require('./routes/checkwaranty');

var claimproduct = require('./routes/claimproduct');
var claimlist = require('./routes/claimlist');
var claimstatus = require('./routes/claimstatus');
var claimlistwh = require('./routes/claimlistwh');

var claimstep = require('./routes/claimstep');
var report = require('./routes/report');
var reportbranch = require('./routes/reportbranch');
var reportsale = require('./routes/reportsale');
var reportcustomer = require('./routes/reportcustomer');
var reportwaranty = require('./routes/reportwaranty');
var reportwaranty_type = require('./routes/reportwaranty_type');
var reportwaranty_brand = require('./routes/reportwaranty_brand');
var reportclaim = require('./routes/reportclaim');
var reportwarrantynew = require('./routes/reportwarrantynew');
var wheelwarantycondition = require('./routes/wheelwarantycondition');
var tirewarantycondition = require('./routes/tirewarantycondition');



var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);
require('./config/passport')(passport);


var port = process.env.PORT || 8080;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));



app.use(session({
    key: 'sessid',
    secret: 'This is secret',
    resave: true,
    saveUninitialized: true,
    //store: new RedisStore(redisOptions),
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
        signed: false
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/', routes);
app.use('/maps', maps);
app.use('/profile', profile);
app.use('/setup', setup);
app.use('/users', users);
app.use('/register', register);
app.use('/customerlist', customerlist);
app.use('/customerdetail', customerdetail);
app.use('/customeredit', customeredit);
app.use('/createmaster', createmaster);
app.use('/createcarbrand', createcarbrand);
app.use('/master', master);
app.use('/carbrand', carbrand);
app.use('/product', product);
app.use('/createproduct', createproduct);
app.use('/waranty', waranty);
app.use('/checkwaranty', checkwaranty);

app.use('/claimproduct', claimproduct);
app.use('/claimlist', claimlist);
app.use('/claimstatus', claimstatus);
app.use('/claimlistwh', claimlistwh);
app.use('/claimstep', claimstep);
app.use('/report', report);
app.use('/reportbranch', reportbranch);
app.use('/reportsale', reportsale);
app.use('/reportcustomer', reportcustomer);
app.use('/reportwaranty', reportwaranty);
app.use('/reportwaranty_type', reportwaranty_type);
app.use('/reportwaranty_brand', reportwaranty_brand);
app.use('/reportclaim', reportclaim);

app.use('/reportwarrantynew', reportwarrantynew);
app.use('/wheelwarantycondition', wheelwarantycondition);
app.use('/tirewarantycondition', tirewarantycondition);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 200
}));

/*app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
 });*/

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    next();
});



app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);

    // Pass to next layer of middleware
    next();
});


// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;