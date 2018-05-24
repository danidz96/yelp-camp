var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    Comment =  require('./models/comment'),
    seedDB = require('./seeds');

seedDB();
mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


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

app.listen(3000, function() {
  console.log('YelpCamp Server has started');
});
