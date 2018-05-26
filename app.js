var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    Campground = require('./models/campground'),
    Comment =  require('./models/comment'),
    User = require('./models/user');
    seedDB = require('./seeds');

seedDB();
mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


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

app.get('/', function(req, res) {
  res.render('landing');
});


app.get('/campgrounds', function(req, res) {
  //get campgrounds from the db
  Campground.find({}, function (err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', {campgrounds: allCampgrounds});
    }
  });
 
});

//CREATE - add a new campground
app.post('/campgrounds', function (req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = { name: name, image: image, description: desc };
  //Create a new campground and save to the db
  Campground.create(newCampground, function (err, newCreated) {
     if (err) {
       console.log(err);
     } else{
      res.redirect('/campgrounds');
     }
  });

});

app.get('/campgrounds/new', function (req, res) {
  res.render('campgrounds/new');
});

//SHOW - shows more info
app.get('/campgrounds/:id', function (req, res) {
  //find  the id of the campground
  console.log(res);
  Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/show', {campground: foundCampground});
    }
  });
});

//=========================================
//Comments routes
//=========================================

app.get('/campgrounds/:id/comments/new', function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', {campground: campground});
    }
  });
});

app.post("/campgrounds/:id/comments", function (req, res) {
  //lookup campground using ID
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect('/campgrounds/' + campground._id);
        }
      });
    }
  });

});

//=========================================
//Auth routes
//=========================================

//show register form

app.get('/register', function (req, res) {
  res.render('register');
});

app.post('/register', function (req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, res, function () {
      res.redirect('/campgrounds');
    });
  });
});

//show login form

app.get('/login', function (req, res) {
  res.render('login');
});

//handling login logic

app.post('/login', passport.authenticate('local', 
  {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
   }), function (req, res) {
  });


// logout logic route
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/campgrounds');
});


app.listen(3000, function() {
  console.log('YelpCamp Server has started');
});
