var spotify_app = angular.module('spotify_app', ['ngRoute', 'spotifyControllers', 'ngMaterial', 'LocalStorageModule']);

spotify_app
.config(function (localStorageServiceProvider) {
  localStorageServiceProvider.setStorageType('localStorage')
})
.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default').primaryPalette('green');
})
.config(function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'home.html'
      }).
      when('/newsfeed', {
        templateUrl: 'home.html'
      }).
      when('/artists', {
        templateUrl: 'artists.html'
      }).
      when('/help', {
        templateUrl: 'help.html'
      }).
      when('/artist/:artistName', {
        templateUrl: 'artistpage.html'
      }).
      otherwise, {
        templateUrl: 'help.html'
      }
})
