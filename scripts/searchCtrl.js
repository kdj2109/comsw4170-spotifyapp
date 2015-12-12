var searchControllers = angular.module('searchControllers', [])

searchControllers.controller('searchCtrl',
    function($scope, $http) {
        // To access Spotify API
        var API_KEY = 'NGB9ACOOVZV9AOTEZ';

        // Query string for the search bar in home.html
        $scope.query_string = '';

        // List of artists
        $scope.artist_list = []

        // Base url to query for artists
        var base_url = 'https://api.spotify.com/v1/search?type=artist&q='

        // Search function
        $scope.search = function() {
            url = base_url + $scope.query_string
            $http.get(url).then(
                function(data) {
                    $scope.artist_list = data.data.artists.items;
                    console.log($scope.artist_list)
                }, function(err, data) {
                    console.log(err, data);
                }
            )

        }
    }
);