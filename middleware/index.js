var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    //is user logged in?
    if (req.isAuthenticated()) {
        //does user own the campground
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err || !foundCampground) {
                req.flash('error', 'Campground not found');
                res.redirect('/campgrounds');
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'You do not have permissions to do that');
                    res.redirect('back');
                }
            }
        });
    } else {
        //if not, redirect
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('back');
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    //is user logged in?
    if (req.isAuthenticated()) {
        //does user own the comment
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err || !foundComment) {
                req.flsh('error', 'Comment not found');
                res.redirect('/campgrounds');
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'You do not have permission to do that');
                    res.redirect('back');
                }
            }
        });
    } else {
        //if not, redirect
        req.flash('error', 'You need to be logged in to do that');
        res.redirect('back');
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('/login');
};

module.exports = middlewareObj;