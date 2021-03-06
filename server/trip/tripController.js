var Trip = require('./tripModel.js');
var User = require('../users/userModel.js');
var Q = require('q');

var findTrip = Q.nbind(Trip.findOne, Trip);
var findTrips = Q.nbind(Trip.find, Trip);
var createTrip = Q.nbind(Trip.create, Trip);

var findUser = Q.nbind(User.findOne, User);
var findUsers = Q.nbind(User.find, User);
var createUser = Q.nbind(User.create, User);

module.exports = {
  getAllTrips: function (req, res, next) {
    var username = req.params.username;
    findUser({username: username})
      .then(function(user) {
        findTrips({_id: {$in: user.trips}})
          .then(function(trips) {
            res.status(200).json(trips);
          });
      })
      .fail(function(error) {
        next(error);
      });
  },

  addTrip: function(req, res, next) {
    var username = req.body.username;
    var tripname = req.body.tripname;
    var users = req.body.users.filter(function(name) { return name.length; });
    var journey = {
      startPoint: req.body.start,
      endPoint: req.body.end
    };
    findUser({username: username})
      .then(function(user) {
        var newTrip = {
          name: tripname,
          creator: user._id,
          journeys: [journey]
        };
        Trip.create(newTrip)
          .then(function(trip) {
            trip.users.push(user._id);
            trip.save();
            user.trips.push(trip._id);
            user.save();
            findUsers({username: {$in: users}})
              .then(function(friends) {
                friends.forEach(function(friend) {
                  if (trip.users.indexOf(friend._id) < 0) {
                    trip.users.push(friend._id);
                    friend.trips.push(trip._id);
                    friend.save();
                  }
                });
                trip.save();
                res.status(201).json(trip);
              });
          });
      })
      .catch(function (error) {
          next(error);
      });
  },

  getTrip: function(req, res, next) {
    var tripId = req.params.tripId;
    findTrip({_id: tripId})
      .then(function(trip) {
        res.status(200).json(trip);
      })
      .catch(function (error) {
        next(error);
      });
  },

  addUser: function(req, res, next) {
    var username = req.body.username;
    var tripId = req.body.trip_id;
    findUser({username: username})
      .then(function(user) {
        findTrip({_id: tripId})
          .then(function(trip) {
            user.trips.push(tripId);
            trip.users.push(user._id);
            user.save();
            trip.save();
            res.status(201).json(trip);
          });
      })
      .catch(function (error) {
        next(error);
      });
  }
};
