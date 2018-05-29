var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');
var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

var geocoder = NodeGeocoder(options);

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
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var newCampground = { name: name, image: image, description: desc, author: author, location: location, lat: lat, lng: lng };
        //Create a new campground and save to the db
        Campground.create(newCampground, function (err, newCreated) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/campgrounds');
            }
        });
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
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;
        //find and update the correct campground
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err) {
            if (err) {
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success", "Successfully Updated!");
                res.redirect('/campgrounds/' + req.params.id);
            }
        });
    });   
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