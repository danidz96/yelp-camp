var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Campground = require('./models/campground'),
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
      res.render('index', {campgrounds: allCampgrounds});
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
  res.render('new');
});

//SHOW - shows more info
app.get('/campgrounds/:id', function (req, res) {
  //find  the id of the campground
  console.log(res);
  Campground.findById(req.params.id, function (err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      res.render('show', {campground: foundCampground})
    }
  });
});

app.listen(3000, function() {
  console.log('YelpCamp Server has started');
});
