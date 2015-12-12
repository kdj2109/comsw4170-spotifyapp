var spotifyControllers = angular.module('spotifyControllers', []);

// HIDE THIS SOMEHOW
var API_KEY = 'NGB9ACOOVZV9AOTEZ ';
var SPOTIFY_CLIENT_ID = 'd1a98ebf9a8647e08fa127a4e2636602';
var SPOTIFY_SECRET_KEY = '8f99388f6c8f4470a2bd7104ac86a168';


// // takes an obj literal and converts it to a query string
var serialize = function(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

spotifyControllers.controller('SearchController', ['$scope', '$http', '$mdDialog', function($scope, $http, $mdDialog) {

  $scope.myArtists = [];

  $scope.form = {
    artist: ""
  };

  $scope.reviews = null;
  $scope.news = null;
  $scope.blogPosts = null;

  function showAlert() {
      alert = $mdDialog.alert()
        .title('Warning!')
        .content('Please type in an artist\'s name!')
        .ok('Close');

      $mdDialog
          .show( alert )
          .finally(function() {
            alert = undefined;
          });
    }


  $scope.getNewReleases = function() {
    
  }

  // reviews endpoint
  $scope.getReviews = function(artistName) {

    var req = { 'name': artistName, 'api_key': API_KEY, 'format': 'jsonp' };

    var url = 'http://developer.echonest.com/api/v4/artist/reviews?callback=JSON_CALLBACK&' + serialize(req);

    console.log(url);

    if (!artistName) {
      showAlert();
      return;
    }

    $http.jsonp(url).success(function(data) { 
      console.log('success');
      console.log(data.response.reviews);
      $scope.reviews = data.response.reviews;
    }).
    error(function(data) {
      console.log(data);
      console.log('errorrrrrrr')
    });
  }

  // news endpoint
  $scope.getNews = function(artistName) {
    var req = { 'name': artistName, 'api_key': API_KEY, 'format': 'jsonp' };
    var url = 'http://developer.echonest.com/api/v4/artist/news?callback=JSON_CALLBACK&' + serialize(req);

    console.log(url);

    if (!artistName) {
      showAlert();

      return;
    }

    $http.jsonp(url).success(function(data) { 
      console.log('success');
      console.log(data);
      $scope.news = data.response.news;
    }).
    error(function(data) {
      console.log(data);
      console.log('errorrrrrrr')
    });
  }

  // blog posts endpoint
  $scope.getBlogPosts = function(artistName) {
    var req = { 'name': artistName, 'api_key': API_KEY, 'format': 'jsonp' , 'high_relevance': true};
    var url = 'http://developer.echonest.com/api/v4/artist/blogs?callback=JSON_CALLBACK&' + serialize(req);

    console.log(url);

    if (!artistName) {
      showAlert();

      return;
    }

    $http.jsonp(url).success(function(data) { 
      console.log('success');
      console.log(data);
      $scope.blogPosts = data.response.blogs;
    }).
    error(function(data) {
      console.log(data);
      console.log('errorrrrrrr')
    });
  }

}]);