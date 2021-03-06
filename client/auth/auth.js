angular.module('roadtrippin.auth', [])

.controller('authController', function($scope, $window, $location, authFactory) {
  $scope.user = {};
  $scope.loginError = false;
  $scope.errorMessage = '';
  
  var setAuthToken = function(token, username) {
    if (token && typeof token !== 'object') {
      $scope.loginError = false;
      $window.localStorage.setItem('com.roadtrippin', token);
      $window.localStorage.setItem('profile', username);
      $location.path('/');
    } else if (typeof token === 'object') {
      $scope.loginError = true;
      $scope.errorMessage = token.error;
    }
  };

  $scope.signin = function(valid) {
    if (valid) {
      authFactory.signin($scope.user)
        .then(function(token) {
          setAuthToken(token, $scope.user.username);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  };
  
  $scope.signup = function(valid) {
    if (valid) {
      authFactory.signup($scope.user)
        .then(function(token) {
          setAuthToken(token, $scope.user.username);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  };
});