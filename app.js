var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/yelp_camp');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');


app.get('/', function(req, res) {
  res.render('landing');
});

//schema setup
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model('Campground', campgroundSchema);

/* Campground.create({
  
    name: 'Granite Hill',
    image: 'https://images.unsplash.com/photo-1503789597747-41de608aca69?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1e39a51d6a2893ca49d551ad22e86ccc&auto=format&fit=crop&w=500&q=60',
    description: 'This is a huge granite hill, no bathrooms. No water. Beautiful granite!'
  }, function (err, campground) {
    if (err) {
      console.log(err);
    } else {
      console.log('New Campground Created');
      console.log(campground);
    }
  }); */

var campgrounds = [
  { name: 'Salmon Creek', image: 'https://images.unsplash.com/photo-1455763916899-e8b50eca9967?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ec456c4aeb71d3aecbe65e586d186ec0&auto=format&fit=crop&w=500&q=60' },
  { name: 'Granite Hill', image: 'https://images.unsplash.com/photo-1503789597747-41de608aca69?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1e39a51d6a2893ca49d551ad22e86ccc&auto=format&fit=crop&w=500&q=60' },
  { name: 'High Mountain', image: 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?ixlib=rb-0.3.5&s=73115e54fa3d099fcb2d92ccf12eee41&auto=format&fit=crop&w=500&q=60' },
  { name: 'Salmon Creek', image: 'https://images.unsplash.com/photo-1455763916899-e8b50eca9967?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ec456c4aeb71d3aecbe65e586d186ec0&auto=format&fit=crop&w=500&q=60' },
  { name: 'Granite Hill', image: 'https://images.unsplash.com/photo-1503789597747-41de608aca69?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1e39a51d6a2893ca49d551ad22e86ccc&auto=format&fit=crop&w=500&q=60' },
  { name: 'High Mountain', image: 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?ixlib=rb-0.3.5&s=73115e54fa3d099fcb2d92ccf12eee41&auto=format&fit=crop&w=500&q=60' },
  { name: 'Salmon Creek', image: 'https://images.unsplash.com/photo-1455763916899-e8b50eca9967?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ec456c4aeb71d3aecbe65e586d186ec0&auto=format&fit=crop&w=500&q=60' },
  { name: 'Granite Hill', image: 'https://images.unsplash.com/photo-1503789597747-41de608aca69?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1e39a51d6a2893ca49d551ad22e86ccc&auto=format&fit=crop&w=500&q=60' },
  { name: 'High Mountain', image: 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?ixlib=rb-0.3.5&s=73115e54fa3d099fcb2d92ccf12eee41&auto=format&fit=crop&w=500&q=60' }
];

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
  console.log(res);
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
