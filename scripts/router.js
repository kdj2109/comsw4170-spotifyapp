var spotify_app = angular.module('spotify_app', ['ngRoute', 'spotifyBrowse', 'ngMaterial']);

spotify_app.config(['$routeProvider', '$mdThemingProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'home.html',
        controller: 'SearchController'
      }).
      when('/artists', {
        templateUrl: 'artists.html'
      })
  }]);
