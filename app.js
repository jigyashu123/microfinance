var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    exphbs = require('express-ejs-layouts'),
    engine = require('ejs-locals'),
    session = require('express-session'),
    passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    bodyParser = require('body-parser'),
    expressValidator = require('express-validator'),
    flash = require('connect-flash'),
    mongo = require('mongodb'),
    mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator');

     mongoose.connect('mongodb://localhost/loginapp');

     var db = mongoose.connection;
     // ROUTES
     var index = require('./routes/index');
     var users = require('./routes/users');

     // App Initialization
     var app = express();

     // view engine setup
     app.set('views', path.join(__dirname, 'views'));
     //app.engine('ejs', exphbs({
       //defaultLayout:'layout'
     //}));
     app.set('view engine', 'ejs');
     // Body Parser middleware
     app.use(logger('dev'));
     app.use(bodyParser.json());
     app.use(bodyParser.urlencoded({ extended: false }));

     app.use(cookieParser());
     app.use(express.static(path.join(__dirname, 'public')));

     app.use(session({
       secret: 'secret',
       saveUninitialized: false,
       resave: false
     }));

     app.use(passport.initialize());
     app.use(passport.session());



      app.use(expressValidator({
      errorFormatter: function(param, msg, value) {
           var namespace = param.split('.')
           , root    = namespace.shift()
           , formParam = root;

         while(namespace.length) {
           formParam += '[' + namespace.shift() + ']';
         }
         return {
           param : formParam,
           msg   : msg,
           value : value
         };
       }
     }));
     app.use(flash());
     app.use(function (req, res, next) {
       res.locals.success_msg = req.flash('success_msg');
       res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
        res.locals.user = req.user || null;
       next();
     });

app.use('/', index);
app.use('/users', users);

app.set('port',(process.env.port || 3000));
app.listen(app.get('port'),function(){
  console.log('server started on port' +app.get('port'));
});
module.exports  = app;
