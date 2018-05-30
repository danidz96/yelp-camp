require('dotenv').config();
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override'),
    flash = require('connect-flash'),
    Campground = require('./models/campground'),
    Comment =  require('./models/comment'),
    User = require('./models/user'),
    seedDB = require('./seeds');

//requiring routes
var campgroundRoutes = require('./routes/campgrounds'),
    commentRoutes = require('./routes/comment'),
    indexRoutes = require('./routes/index');

var port = process.env.PORT || 3000;

mongoose.connect(process.env.DATABASEURL || 'mongodb://localhost/yelp_camp');


app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

//Passport Configuration
app.use(require('express-session')({
  secret: 'password secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.locals.moment = require("moment");

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use('/', indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);

app.listen(port, function() {
  console.log('YelpCamp Server has started');
});
