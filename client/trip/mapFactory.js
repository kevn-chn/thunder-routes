angular.module('roadtrippin.mapsFactory', [])

  .factory('mapFactory', function($http, $q, $window, $location) {

    var locationAutoComplete = function(inputField, callback) {
      var startAutoComplete = new google.maps.places.Autocomplete(
        document.getElementById(inputField), {
        types: ['geocode']
      });

      startAutoComplete.addListener('place_changed', function() {
        var address = startAutoComplete.getPlace().formatted_address;
        callback(address);
      });
    };

    //send endpoints and array of waypoints to the server
    var saveJourneyWithWaypoints = function (tripObject) {
      var deferred = $q.defer ();
      $http({
        method: 'POST',
        url: '/saveJourney',
        data: JSON.stringify(tripObject)
      }).then(function (res) {
        deferred.resolve (res);
      }).catch(function (err) {
        deferred.reject (err);
      });
      return deferred.promise;
    };

    var getAllRoutes = function() {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: '/saveJourney'
      }).then(function (res) {
        deferred.resolve (res.data);
      }).catch(function (err) {
        deferred.reject (err);
      });
      return deferred.promise;
    };

    var signout = function() {
      $window.localStorage.removeItem('com.roadtrippin');
      $location.path('/signin');
    };

    return {
      locationAutoComplete: locationAutoComplete,
      saveJourneyWithWaypoints: saveJourneyWithWaypoints,
      getAllRoutes: getAllRoutes,
      signout: signout
    };
  });