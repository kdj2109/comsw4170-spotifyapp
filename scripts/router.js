var spotify_app = angular.module('spotify_app', ['ngRoute']);

spotify_app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'home.html'
      }).
      when('/artists', {
        templateUrl: 'artists.html'
      })
  }]);
