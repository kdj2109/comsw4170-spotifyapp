<<<<<<< HEAD
var spotify_app = angular.module('spotify_app', ['ngRoute', 'ngMaterial', 'spotifyControllers',]);
=======
var spotify_app = angular.module('spotify_app', ['ngRoute', 'spotifyControllers', 'ngMaterial', 'artistPage']);
>>>>>>> 4e3eeb6558e84645e5e400e02c5133826e859c4d

spotify_app.config(['$routeProvider', '$mdThemingProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'home.html'
      }).
      when('/artists', {
        templateUrl: 'artists.html',
        controller: 'ArtistController'
      })
  }]);
