var spotify_app = angular.module('spotify_app', ['ngRoute', 'ngMaterial', 'spotifyControllers',]);

spotify_app.config(['$routeProvider', '$mdThemingProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'home.html'
      }).
      when('/artists', {
        templateUrl: 'artists.html'
      })
  }]);
