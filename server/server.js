var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var parser = require('body-parser');
var userController = require('./users/userController.js');
var journeyController = require('./journey/journeyController.js');
var tripController = require('./trip/tripController.js');

var app = express();

app.use(express.static(__dirname + '/../client'));
app.use(parser.json());
app.use(morgan('dev'));


var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/roadtrippin';
mongoose.connect(mongoUri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongoose is connected');
});


app.post('/addJourney', journeyController.addJourney);
app.post('/addTrip', tripController.addTrip);
app.get('/trip/:tripId', tripController.getTrip);
app.get('/getAllTrips/:username', tripController.getAllTrips);
app.post('/signin', userController.signin);
app.post('/signup', userController.signup);
app.use(userController.errorHandler);


var port = process.env.PORT || 8080;

app.listen(port, function() {
  console.log('Listening to: ' + port);
});

module.exports = app;
