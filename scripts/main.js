var spotifyApp = angular.module('spotifyApp', ['ngMaterial']);

// HIDE THIS SOMEHOW
var API_KEY = 'NGB9ACOOVZV9AOTEZ';

spotifyApp.controller('ArtistController', function($scope, $http, $sce) {

  $scope.songs = [];
  $scope.trackset = "";
  $scope.myArtists = ["Kendrick Lamar", "Fetty Wap","Beyonce", "Nicki Minaj", "Justin Bieber"];

  $scope.form = {
    artist: ""
  };

  // reviews endpoint
  $scope.switchArtist = function(artistName) {

    if(artistName=="newsfeed"){
        //populate newsfeed instead

    }else{
      var url = 'https://api.spotify.com/v1/search?q='+artistName+'&type=artist&limit=1';

      //get artist ID from name
      $http.get(url).success(function(data) { 
        var artistID = data.artists.items[0].id;

        //get top tracks from artist ID
        url = 'https://api.spotify.com/v1/artists/'+artistID+'/top-tracks?country=US';
        console.log(url);
        $http.get(url).success(function(data){
            $scope.trackset="";
            $scope.songs = data.tracks;
            
            //create iframe spotify list
            for(var i=0; i<9;i++){
              var id = $scope.songs[i].id + ",";
              $scope.trackset = $scope.trackset.concat(id);
            } 
            var frame="<iframe src='https://embed.spotify.com/?uri=spotify:trackset:title:"+
            $scope.trackset+"' frameborder='0' width='640' height='600'></iframe>";
            $scope.iframe = $sce.trustAsHtml(frame);
        }).error(function(data){
          console.log('tracks not found');
        })

      }).
      error(function(data) {
        console.log(data);
        console.log('artist not found')
      });
    }
  }





}).config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
      .primaryPalette('green');
  });