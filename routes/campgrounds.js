var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');

router.get('/', function (req, res) {
    //get campgrounds from the db
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', { campgrounds: allCampgrounds, currentUser: req.user });
        }
    });

});

//CREATE - add a new campground
router.post('/', middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = { name: name, image: image, description: desc, author: author };
    //Create a new campground and save to the db
    Campground.create(newCampground, function (err, newCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });

});

router.get('/new', middleware.isLoggedIn, function (req, res) {
    res.render('campgrounds/new');
});

//SHOW - shows more info
router.get('/:id', function (req, res) {
    //find  the id of the campground
    console.log(res);
    Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
        if (err || !foundCampground) {
            req.flash('error', 'Campground not found');
            res.redirect('/campgrounds');
        } else {
            res.render('campgrounds/show', { campground: foundCampground });
        }
    });
});

//Edit campground route
router.get('/:id/edit', middleware.checkCampgroundOwnership, function (req, res) {
   Campground.findById(req.params.id, function (err, foundCampground) {
       res.render('campgrounds/edit', { campground: foundCampground });
    });
});
//Update campground route
router.put('/:id', middleware.checkCampgroundOwnership, function (req, res) {
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err) {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
    //redirect
});

//destroy campground route
router.delete('/:id', middleware.checkCampgroundOwnership, function (req, res) {
   Campground.findByIdAndRemove(req.params.id, function (err, foundCampground) {
      if (err) {
          res.redirect('/campgrounds');
      } else {
          res.redirect('/campgrounds');
      }
   });
});

module.exports = router;