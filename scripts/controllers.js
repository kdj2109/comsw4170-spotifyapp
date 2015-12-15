var spotifyControllers = angular.module('spotifyControllers', []);

spotifyControllers.factory('userArtistsShared', function () {

    var artists = [];

    return {
        get: function () {
            return artists;
        },
        set: function (_artists) {
            artists = _artists;
        }
    };
});


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

spotifyControllers.controller('navController', function($scope) {
  $scope.menuOpen = false;

  $scope.toggle = function() {
    if ($scope.menuOpen) {
      $scope.menuOpen = false;
    } else {
      $scope.menuOpen = true;
    }
  }
});

/* SEARCH BAR CONTROLLER */
spotifyControllers.controller('searchBarCtrl',
    function($scope, $http, $timeout, $mdDialog, localStorageService, userArtistsShared) {
        $scope.display_artist_name = function(artist_name) {
            if (artist_name.length > 20) {
                return artist_name.slice(0, 20) + '...';
            }

            return artist_name;
        }

        // Query string for the search bar in home.html
        $scope.query_string = '';

        // Show artist list dropdown under search
        $scope.show_artist_list = false;

        // List of artists
        $scope.artist_list = [];

        $scope.clear_search = function() {
            $scope.show_artist_list = false;
        }

        // list of artists user is already tracking
        // $scope.userArtists = localStorageService.get('userArtists') || [];
        userArtistsShared.set(localStorageService.get('userArtists') || []);
        $scope.userArtists = userArtistsShared.get();

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
          userArtistsShared.set($scope.userArtists);
          localStorageService.set('userArtists', $scope.userArtists);
          $scope.show_artist_list = false;
          showSuccess(artistName);

        };

        $scope.alreadyTracking = function(artistName) {
          if ($scope.userArtists.indexOf(artistName) >= 0) {
              return true;
          }
          return false;
        }

        $scope.removeArtist = function(artistName) {

           console.log(artistName);

          var index = $scope.userArtists.indexOf(artistName);

          if (index > -1) {
            $scope.userArtists.splice(index, 1);
            userArtistsShared.set($scope.userArtists);
            localStorageService.set('userArtists', $scope.userArtists);
            showRemoval(artistName);
          } else {
            console.log('this should not happen');
          }
           
         };


         function showRemoval(artistName) {
           alert = $mdDialog.alert()
             .title('Removed ' + artistName)
             .content('You have stopped tracking ' + artistName + '!')
             .ok('Close');

           $mdDialog
               .show( alert )
               .finally(function() {
                 alert = undefined;
               });
         }


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
            .content('You are already tracking ' + artistName + '.')
            .ok('Close');

          $mdDialog
              .show( alert )
              .finally(function() {
                alert = undefined;
              });
        }

    }
);


/* NEWSFEED CONTROLLER */
spotifyControllers.controller('NewsFeedController', function($scope, $http, $mdDialog, $q, $timeout, localStorageService, userArtistsShared) {

  $scope.news_per_artist = {};

  $scope.formatDate = function(datestring){
    var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];

    var date = new Date(datestring);
    var month = monthNames[date.getMonth()];
    var year = date.getFullYear();
    var day = date.getDate();

    return month + " "+ day + ", " + year;

  }

  $scope.formatText = function(text){
    text = text.replace(/<span>|<\/span>/g, '');
    text = text.replace(/&#39;/g, '\'');
    text = text.replace(/&#34;/g, '\"');

    return text;
  }

  $scope.nextNews = function() {
    console.log('next');
  }

  $scope.prevNews = function() {
    console.log('prev');
  }

  // news endpoint
  $scope.getNews = function(artistName, numResults) {
    var req = { 'name': artistName, 'api_key': API_KEY, 'format': 'jsonp', 'results':  numResults };
    var url = 'http://developer.echonest.com/api/v4/artist/news?callback=JSON_CALLBACK&' + serialize(req);

    console.log(url);

    $http.jsonp(url)
      .then(function(data) { 
        console.log('success');
        console.log(data);
        $scope.news_per_artist[artistName] = data.data.response.news;
      }, 
      function(error) {
        console.log('errorrrrrrr');
      });
  }

  $scope.feedArtists = userArtistsShared.get();

  var numResults = 5;

  // var news = [];

  for (var i = 0; i < $scope.feedArtists.length; i++) {
    $scope.getNews($scope.feedArtists[i], numResults);
  }

});

/* SEARCH CONTROLLER */
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


/* ARTIST CONTROLLER */
spotifyControllers.controller('ArtistController', function($scope, $http, $sce, localStorageService, userArtistsShared) {

  //initial variables
  $scope.songs = [];
  $scope.trackset = "";


  // $scope.myArtists = localStorageService.get('userArtists') || ["U2", "Nick Jonas", "The Weeknd", "Drake", "Kendrick Lamar", "Fetty Wap","Beyonce", "Nicki Minaj", "Justin Bieber"];
  
  $scope.myArtists = userArtistsShared.get();

  $scope.setFirst = function(){
    if($scope.myArtists[0]!=undefined){ $scope.switchArtist($scope.myArtists[0]);
    }else{ 
          document.getElementById("artistPage").style.visibility="hidden";
          document.getElementById("newsfeed").style.visibility="hidden";
        }
  }

  // if (!localStorageService.get('userArtists')) {
  //   $scope.myArtists = ["U2", "Nick Jonas", "The Weeknd", "Drake", "Kendrick Lamar", "Fetty Wap","Beyonce", "Nicki Minaj", "Justin Bieber"];
  //   localStorageService.set('userArtists', $scope.myArtists);
  // }

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
        $scope.artistPicture;
        $scope.artistNews;
        $scope.artistBlogs;
        $scope.artistReviews;

        // check if artist has any pictures, and if not, assign a no_img url
        if (data.artists.items[0].images.length > 0) {
          $scope.artistPicture = data.artists.items[0].images[0].url;
        } else {
          $scope.artistPicture = '/assets/no_img.png';
        }

        $scope.artistName = data.artists.items[0].name;
        var artistID = data.artists.items[0].id


        //get top tracks from artist ID
        url = 'https://api.spotify.com/v1/artists/'+artistID+'/top-tracks?country=US';
        $http.get(url).success(function(data){
            $scope.trackset="";
            $scope.artistData="";
            $scope.songs = data.tracks;
            
            //create iframe spotify list
            for(var i=0; i<10;i++){
              if($scope.songs[i]!=undefined){
                var id = $scope.songs[i].id + ",";
                $scope.trackset = $scope.trackset.concat(id);
              }
            } 
            var playlist = "<iframe src='https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:"+$scope.trackset+"' frameborder='0' allowtransparency='true'"+
            "height='600px' width='460px'></iframe>";
            $scope.playButton = $sce.trustAsHtml(playlist);
            var frame="<iframe src='https://embed.spotify.com/follow/1/?uri=spotify:artist:"+artistID+
            "&size=basic&theme=light' width='200' height='25' scrolling='no' frameborder='0' style='border:none; overflow:hidden;'' allowtransparency='true'></iframe>"
            $scope.iframe = $sce.trustAsHtml(frame);



            //get artists biographies news from echo

            url = 'http://developer.echonest.com/api/v4/artist/news?callback=JSON_CALLBACK'+
            '&format=jsonp&api_key=NGB9ACOOVZV9AOTEZ&id=spotify:artist:'+artistID;
            $http.jsonp(url).success(function(data){
              $scope.artistNews = data.response.news;
              if(data.response.news[0]==undefined){
                document.getElementById("newsfeed").style.visibility="hidden";
                document.getElementById("artistPage").style.visibility="visible";
                console.log("here");
              }else{
                for (var i=0;i<$scope.artistNews.length;i++){
                   $scope.artistNews[i].date_found = formatDate($scope.artistNews[i].date_found);
                   $scope.artistNews[i].summary = formatText($scope.artistNews[i].summary);
                   $scope.artistNews[i].name = formatText($scope.artistNews[i].name);   
                   document.getElementById("artistPage").style.visibility="visible";           
                   document.getElementById("newsfeed").style.visibility="visible";           

                }
              }

              //get blog posts 
              url = 'http://developer.echonest.com/api/v4/artist/blogs?callback=JSON_CALLBACK'+
              '&format=jsonp&api_key=NGB9ACOOVZV9AOTEZ&id=spotify:artist:'+artistID;
              $http.jsonp(url).success(function(data){
                $scope.artistBlogs = data.response.blogs;
                for(var i=0; i<$scope.artistBlogs.length;i++){
                  $scope.artistBlogs[i].date_posted = formatDate($scope.artistBlogs[i].date_posted);
                  $scope.artistBlogs[i].summary = formatText($scope.artistBlogs[i].summary);
                  $scope.artistBlogs[i].name = formatText($scope.artistBlogs[i].name); 
                }
                  //get artist reviews 
                  url = 'http://developer.echonest.com/api/v4/artist/reviews?callback=JSON_CALLBACK'+
                  '&format=jsonp&api_key=NGB9ACOOVZV9AOTEZ&id=spotify:artist:'+artistID;
                  $http.jsonp(url).success(function(data){
                  $scope.artistReviews = data.response.reviews;
                    for(var i=0; i<$scope.artistReviews.length;i++){
                      $scope.artistReviews[i].date_found = formatDate($scope.artistReviews[i].date_found);
                      $scope.artistReviews[i].summary = formatText($scope.artistReviews[i].summary);
                      $scope.artistReviews[i].name = formatText($scope.artistReviews[i].name); 
                    }
                  }).error(function(data){
                    console.log("no reviews");
                  })
              }).error(function(data){
                  console.log("no blog posts");
              })
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
    $scope.setFirst();
  }

}


$scope.deleteArtist = function(i){
  $scope.myArtists.splice(i,1);
  localStorageService.set('userArtists', $scope.myArtists);
  userArtistsShared.set($scope.myArtists);
  
}

});


spotifyControllers.controller('artistController', function($scope, $http, $location, $sce, $mdDialog, localStorageService, userArtistsShared) {
    var showArtistPage = function(artistName) {

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
            $scope.artistPicture;

            // check if artist has any pictures, and if not, assign a no_img url
            if (data.artists.items[0].images.length > 0) {
              $scope.artistPicture = data.artists.items[0].images[0].url;
            } else {
              $scope.artistPicture = '/assets/no_img.png';
            }


            $scope.artistName = data.artists.items[0].name;
            var artistID = data.artists.items[0].id
            console.log(artistID);


            //get top tracks from artist ID
            url = 'https://api.spotify.com/v1/artists/'+artistID+'/top-tracks?country=US';
            $http.get(url).success(function(data){
                $scope.trackset="";
                $scope.artistData="";
                $scope.songs = data.tracks;

                //create iframe spotify list
                for(var i=0; i<10;i++){
                  if($scope.songs[i]!=undefined){
                    var id = $scope.songs[i].id + ",";
                    $scope.trackset = $scope.trackset.concat(id);
                  }
                }

                var playlist = "<iframe src='https://embed.spotify.com/?uri=spotify:trackset:Top Hits:"+$scope.trackset+"' frameborder='0' allowtransparency='true'"+
                "height='600px' width='460px'></iframe>";
                $scope.playButton = $sce.trustAsHtml(playlist);
                var frame="<iframe src='https://embed.spotify.com/follow/1/?uri=spotify:artist:"+artistID+
                "&size=basic&theme=light' width='200' height='25' scrolling='no' frameborder='0' style='border:none; overflow:hidden;'' allowtransparency='true'></iframe>"
                $scope.iframe = $sce.trustAsHtml(frame);



                //get artists biographies news from echo

                url = 'http://developer.echonest.com/api/v4/artist/news?callback=JSON_CALLBACK'+
                '&format=jsonp&api_key=NGB9ACOOVZV9AOTEZ&id=spotify:artist:'+artistID;
                $http.jsonp(url).success(function(data){
                  $scope.artistNews = data.response.news;
                  if(data.response.news[0]!=undefined){
                      document.getElementById("newsfeed").style.visibility="visible";
                      document.getElementById("errormsg").style.visibility="hidden";
                      console.log(data.response);
                      for (var i=0;i<$scope.artistNews.length;i++){
                         $scope.artistNews[i].date_found = formatDate( $scope.artistNews[i].date_found);
                         $scope.artistNews[i].summary = formatText($scope.artistNews[i].summary);
                         $scope.artistNews[i].name = formatText($scope.artistNews[i].name);
                      }
                    }else{
                      document.getElementById("newsfeed").style.visibility="hidden";
                      document.getElementById("errormsg").style.visibility="visible";
                    }
                });

                //get artists biographies news from echo

                url = 'http://developer.echonest.com/api/v4/artist/news?callback=JSON_CALLBACK'+
                '&format=jsonp&api_key=NGB9ACOOVZV9AOTEZ&id=spotify:artist:'+artistID;
                $http.jsonp(url).success(function(data){
                  $scope.artistNews = data.response.news;
                  if(data.response.news[0]==undefined){
                    document.getElementById("newsfeed").style.visibility="hidden";
                    document.getElementById("artistPage").style.visibility="visible";
                    console.log("here");
                  }else{
                    for (var i=0;i<$scope.artistNews.length;i++){
                       $scope.artistNews[i].date_found = formatDate($scope.artistNews[i].date_found);
                       $scope.artistNews[i].summary = formatText($scope.artistNews[i].summary);
                       $scope.artistNews[i].name = formatText($scope.artistNews[i].name);
                       document.getElementById("artistPage").style.visibility="visible";
                       document.getElementById("newsfeed").style.visibility="visible";

                    }
                  }

                  //get blog posts
                  url = 'http://developer.echonest.com/api/v4/artist/blogs?callback=JSON_CALLBACK'+
                  '&format=jsonp&api_key=NGB9ACOOVZV9AOTEZ&id=spotify:artist:'+artistID;
                  $http.jsonp(url).success(function(data){
                    $scope.artistBlogs = data.response.blogs;
                    for(var i=0; i<$scope.artistBlogs.length;i++){
                      $scope.artistBlogs[i].date_posted = formatDate($scope.artistBlogs[i].date_posted);
                      $scope.artistBlogs[i].summary = formatText($scope.artistBlogs[i].summary);
                      $scope.artistBlogs[i].name = formatText($scope.artistBlogs[i].name);
                    }
                      //get artist reviews
                      url = 'http://developer.echonest.com/api/v4/artist/reviews?callback=JSON_CALLBACK'+
                      '&format=jsonp&api_key=NGB9ACOOVZV9AOTEZ&id=spotify:artist:'+artistID;
                      $http.jsonp(url).success(function(data){
                      $scope.artistReviews = data.response.reviews;
                        for(var i=0; i<$scope.artistReviews.length;i++){
                          $scope.artistReviews[i].date_found = formatDate($scope.artistReviews[i].date_found);
                          $scope.artistReviews[i].summary = formatText($scope.artistReviews[i].summary);
                          $scope.artistReviews[i].name = formatText($scope.artistReviews[i].name);
                        }
                      }).error(function(data){
                        console.log("no reviews");
                      })
                  }).error(function(data){
                      console.log("no blog posts");
                  })
                });

            }).error(function(data){
              console.log('tracks not found');
            })
          }).error(function(data) {
            console.log(data);
            console.log('artist not found')
          });
        }
     }

     var formatText = function(text){
       text = text.replace(/<span>|<\/span>/g, '');
       text = text.replace(/&#39;/g, '\'');
       text = text.replace(/&#34;/g, '\"');

       return text;
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


    $scope.alreadyTracking = function(artistName) {
      if ($scope.userArtists.indexOf(artistName) >= 0) {
          return true;
      }
      return false;
    }


     $scope.init = function() {
        url = $location.path()
        artist_name = url.split('/')[2]
        showArtistPage(artist_name);
        $scope.artist = artist_name;
        userArtistsShared.set(localStorageService.get('userArtists') || []);
        $scope.userArtists = userArtistsShared.get();
     }

     $scope.trackArtist = function(artistName) {

       console.log(artistName);

       // already in the list of artists!
       if ($scope.userArtists.indexOf(artistName) >= 0) {
         showAlert(artistName);
         return;
       }

       $scope.userArtists.push(artistName);
       userArtistsShared.set($scope.userArtists);
       localStorageService.set('userArtists', $scope.userArtists);
       $scope.show_artist_list = false;
       showSuccess(artistName);

     };

     $scope.removeArtist = function(artistName) {

       console.log(artistName);

       // already in the list of artists!
       // if ($scope.userArtists.indexOf(artistName) >= 0) {
       //   showAlert(artistName);
       //   return;
       // }

      var index = $scope.userArtists.indexOf(artistName);

      if (index > -1) {
        $scope.userArtists.splice(index, 1);
        userArtistsShared.set($scope.userArtists);
        localStorageService.set('userArtists', $scope.userArtists);
        showRemoval(artistName);
        $scope.show_artist_list = false;
      }
       
     };


     function showRemoval(artistName) {
       alert = $mdDialog.alert()
         .title('Removed ' + artistName)
         .content('You have stopped tracking ' + artistName + '!')
         .ok('Close');

       $mdDialog
           .show( alert )
           .finally(function() {
             alert = undefined;
           });
     }


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
         .content('You are already tracking ' + artistName + '.')
         .ok('Close');

       $mdDialog
           .show( alert )
           .finally(function() {
             alert = undefined;
           });
     }

});