var mongoose = require('mongoose');

//schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model('Campground', campgroundSchema);

module.exports = mongoose.model('Campground', campgroundSchema);
