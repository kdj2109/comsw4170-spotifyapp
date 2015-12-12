var spotifyApp = angular.module('spotifyApp', ['ngRoute',
                                               'searchControllers']);

spotifyApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'home.html'
      }).
      when('/artists', {
        templateUrl: 'artists.html'
      })
  }]);
