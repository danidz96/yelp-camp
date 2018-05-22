var express = require('express');
var app = express();

app.set('view engine', 'ejs');


app.get('/', function(req, res) {
  res.render('landing');
});

app.get('/campgrounds', function(req, res) {
  var campgrounds = [
    {name: 'Salmon Creek', image: 'https://images.unsplash.com/photo-1455763916899-e8b50eca9967?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ec456c4aeb71d3aecbe65e586d186ec0&auto=format&fit=crop&w=500&q=60'},
    {name: 'Granite Hill', image: 'https://images.unsplash.com/photo-1503789597747-41de608aca69?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1e39a51d6a2893ca49d551ad22e86ccc&auto=format&fit=crop&w=500&q=60'},
    {name: 'High Mountain', image: 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?ixlib=rb-0.3.5&s=73115e54fa3d099fcb2d92ccf12eee41&auto=format&fit=crop&w=500&q=60'}
  ]
  res.render('campgrounds', {campgrounds: campgrounds});
});

app.listen(3000, function() {
  console.log('YelpCamp Server has started');
});
