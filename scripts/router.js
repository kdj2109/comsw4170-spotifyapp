var spotify_app = angular.module('spotify_app', ['ngRoute', 'spotifyControllers', 'ngMaterial', 'artistPage']);

spotify_app.config(['$routeProvider', '$mdThemingProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'home.html',
        controller: 'SearchController'
      }).
      when('/artists', {
        templateUrl: 'artists.html',
        controller: 'ArtistController'
      })
  }]);
