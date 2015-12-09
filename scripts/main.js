var spotifyApp = angular.module('spotifyApp', ['ngMaterial']);

// HIDE THIS SOMEHOW
var API_KEY = '';

spotifyApp.controller('SearchController', function($scope) {
  $scope.testing = [{
    'meow': 'kitkat'
  }];

  $scope.form = {
    artist: ""
  };

  // reviews endpoint
  $scope.getReviews = function() {
    var req = {
      method: 'POST',
      url: 'http://example.com',
      headers: {
       'Content-Type': undefined
      },
      data: { test: 'test' }
    }

    $http(req).then(function(){...}, function(){...});
  }

  // news endpoint


  // blog posts endpoint

}).config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
      .primaryPalette('green');
  });