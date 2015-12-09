var spotifyApp = angular.module('spotifyApp', ['ngMaterial']);

// HIDE THIS SOMEHOW
var API_KEY = '';


// takes an obj literal and converts it to a query string
var serialize = function(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

spotifyApp.controller('SearchController', function($scope, $http) {

  $scope.myArtists = [];

  $scope.form = {
    artist: ""
  };

  // reviews endpoint
  $scope.getReviews = function(artistName) {

    var req = { 'name': artistName, 'api_key': API_KEY, 'format': 'jsonp' };

    var url = 'http://developer.echonest.com/api/v4/artist/reviews?callback=JSON_CALLBACK&' + serialize(req);

    console.log(url);

    $http.jsonp(url).success(function(data) { 
      console.log('success');
      console.log(data);
    }).
    error(function(data) {
      console.log(data);
      console.log('errorrrrrrr')
    });
  }

  // news endpoint


  // blog posts endpoint

}).config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
      .primaryPalette('green');
  });