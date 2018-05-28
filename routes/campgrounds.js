var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');

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
router.post('/', isLoggedIn, function (req, res) {
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

router.get('/new', isLoggedIn, function (req, res) {
    res.render('campgrounds/new');
});

//SHOW - shows more info
router.get('/:id', function (req, res) {
    //find  the id of the campground
    console.log(res);
    Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/show', { campground: foundCampground });
        }
    });
});

//Edit campground route
router.get('/:id/edit', checkCampgroundOwnership, function (req, res) {
   Campground.findById(req.params.id, function (err, foundCampground) {
       res.render('campgrounds/edit', { campground: foundCampground });
    });
});
//Update campground route
router.put('/:id', checkCampgroundOwnership, function (req, res) {
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
router.delete('/:id', checkCampgroundOwnership, function (req, res) {
   Campground.findByIdAndRemove(req.params.id, function (err, foundCampground) {
      if (err) {
          res.redirect('/campgrounds');
      } else {
          res.redirect('/campgrounds');
      }
   });
});

//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function checkCampgroundOwnership(req, res, next) {
     //is user logged in?
    if (req.isAuthenticated()) {
        //does user own the campground
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                res.redirect('/campgrounds');
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                   next();
                } else {
                    res.redirect('back');
                }
            }
        });
    } else {
        //if not, redirect
        res.redirect('back');
    }
}

module.exports = router;