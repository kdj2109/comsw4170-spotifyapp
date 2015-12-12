var spotifyApp = angular.module('spotifyApp', ['ngMaterial']);

// HIDE THIS SOMEHOW
var API_KEY = 'NGB9ACOOVZV9AOTEZ';

spotifyApp.controller('ArtistController', function($scope, $http, $sce) {

  //initial variables
  $scope.songs = [];
  $scope.trackset = "";
  $scope.myArtists = ["Kendrick Lamar", "Fetty Wap","Beyonce", "Nicki Minaj", "Justin Bieber"];
  $scope.newsfeed = false;


  $scope.form = {
    artist: ""
  };

  // reviews endpoint
  $scope.switchArtist = function(artistName) {

    if(artistName=="newsfeed"){
        var frame="<span></span>";
        $scope.iframe = $sce.trustAsHtml(frame);
        $scope.newsfeed=false;

    }else{
      var url = 'https://api.spotify.com/v1/search?q='+artistName+'&type=artist&limit=1';

      //get artist ID from name
      $http.get(url).success(function(data) { 
        $scope.newsfeed=true;
        $scope.artistData = data.artists;
        $scope.artistPicture = data.artists.items[0].images[0].url;
        $scope.artistName = data.artists.items[0].name;
        var artistID = data.artists.items[0].id


        //get top tracks from artist ID
        url = 'https://api.spotify.com/v1/artists/'+artistID+'/top-tracks?country=US';
        $http.get(url).success(function(data){
            $scope.trackset="";
            $scope.artistData="";
            $scope.songs = data.tracks;
            
            //create iframe spotify list
            for(var i=0; i<5;i++){
              var id = $scope.songs[i].id + ",";
              $scope.trackset = $scope.trackset.concat(id);
            } 
            var frame="<iframe src='https://embed.spotify.com/?uri=spotify:trackset:title:"+
            $scope.trackset+"' frameborder='0' width='320' height='315' style='display:inline'></iframe>";
            $scope.iframe = $sce.trustAsHtml(frame);



            //get artists biographies news from echo

            url = 'http://developer.echonest.com/api/v4/artist/news?callback=JSON_CALLBACK'+
            '&format=jsonp&api_key=NGB9ACOOVZV9AOTEZ&id=spotify:artist:'+artistID;
            $http.jsonp(url).success(function(data){
              $scope.artistNews = data.response.news;
              for (var i=0;i<$scope.artistNews.length;i++){
                 $scope.artistNews[i].date_found = formatDate( $scope.artistNews[i].date_found);  
                 $scope.artistNews[i].summary = formatText($scope.artistNews[i].summary);
                 $scope.artistNews[i].name = formatText($scope.artistNews[i].name);              
                
              }
            })





        }).error(function(data){
          console.log('tracks not found');
        })
      }).error(function(data) {
        console.log(data);
        console.log('artist not found')
      });
    }
  }

var formatDate = function(datestring){
  var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];

  var date = new Date(datestring);
  var month = monthNames[date.getMonth()];
  var year = date.getFullYear();
  var day = date.getDate();

  return month + " "+ day + ", " + year;

}

var formatText = function(text){
  text = text.replace(/<span>|<\/span>/g, '');
  text = text.replace(/&#39;/g, '\'');
  text = text.replace(/&#34;/g, '\"');

  return text;
}

}).config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
      .primaryPalette('green');
  });