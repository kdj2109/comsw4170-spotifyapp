var spotifyControllers = angular.module('spotifyControllers', []);

// HIDE THIS SOMEHOW
var API_KEY = 'NGB9ACOOVZV9AOTEZ ';
var SPOTIFY_CLIENT_ID = 'd1a98ebf9a8647e08fa127a4e2636602';
var SPOTIFY_SECRET_KEY = '8f99388f6c8f4470a2bd7104ac86a168';


// takes an obj literal and converts it to a query string
var serialize = function(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

// SEARCH BAR CONTROLLER
spotifyControllers.controller('searchBarCtrl',
    function($scope, $http, $timeout, $mdDialog, localStorageService) {
        // Query string for the search bar in home.html
        $scope.query_string = '';

        // Show artist list dropdown under search
        $scope.show_artist_list = false;

        // List of artists
        $scope.artist_list = [];


        // the artist the user wants to track
        $scope.artistToTrack = '';


        // list of artists user is already tracking
        $scope.userArtists = localStorageService.get('userArtists') || [];

        // Base url to query for artists
        var base_url = 'https://api.spotify.com/v1/search?type=artist&q='

        // Search function
        $scope.search = function() {
            if ($scope.query_string == '') {
                $scope.artist_list = [];
                $scope.show_artist_list = false;
                return
            }

            url = base_url + $scope.query_string

            $http.get(url).then(
                function(data) {
                    $scope.artist_list = data.data.artists.items;
                    check_data(data);
                }, function(err, data) {
                    console.log(err, data);
                }
            )
        }

        var check_data = function(data) {
            if (data.data.artists.items.length > 0) {
                $scope.show_artist_list = true;
            } else {
                $scope.show_artist_list = false;
            }
        }

        $scope.trackArtist = function(artistName) {

          console.log(artistName);

          // already in the list of artists!
          if ($scope.userArtists.indexOf(artistName) >= 0) {
            showAlert(artistName);
            return;
          }

          $scope.userArtists.push(artistName);
          localStorageService.set('userArtists', $scope.userArtists);


          showSuccess(artistName);

        };


        function showSuccess(artistName) {
          alert = $mdDialog.alert()
            .title('Success')
            .content('You are now tracking ' + artistName + '!')
            .ok('Close');

          $mdDialog
              .show( alert )
              .finally(function() {
                alert = undefined;
              });
        }

        function showAlert(artistName) {
          alert = $mdDialog.alert()
            .title('Error')
            .content('You are already tracking' + artistName + ' this artist.')
            .ok('Close');

          $mdDialog
              .show( alert )
              .finally(function() {
                alert = undefined;
              });
        }

    }
);

// my artists page
spotifyControllers.controller('myArtistsController', function($scope, $http, $mdDialog, localStorageService) { 


});

// NEWSFEED CONTROLLER

spotifyControllers.controller('NewsFeedController', function($scope, $http, $mdDialog, localStorageService) {
  console.log('hello');



});

// SEARCH CONTROLLER
spotifyControllers.controller('SearchController', function($scope, $http, $mdDialog) {

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

});

spotifyControllers.controller('ArtistController', function($scope, $http, $sce, localStorageService) {

  //initial variables
  $scope.songs = [];
  $scope.trackset = "";
  $scope.myArtists = localStorageService.get('userArtists') || ["U2", "Nick Jonas", "The Weeknd", "Drake", "Kendrick Lamar", "Fetty Wap","Beyonce", "Nicki Minaj", "Justin Bieber"];
  $scope.newsfeed = false;
  $scope.editing=false;


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
            var frame="<iframe src='https://embed.spotify.com/follow/1/?uri=spotify:artist:"+artistID+
            "&size=basic&theme=light' width='200' height='25' scrolling='no' frameborder='0' style='border:none; overflow:hidden;'' allowtransparency='true'></iframe>"
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


$scope.edit = function(){
  if($scope.editing==false){
    $scope.editing=true;
  }else{
    $scope.editing=false;
  }
}


$scope.deleteArtist = function(i){
  $scope.myArtists.splice(i,1);

}


});