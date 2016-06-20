"use strict";
myApp.controller('restaurantController', function ($routeParams, $location, $scope, mapService, $rootScope) {

    $('.homePage').css('display', 'none');
    $scope.currentBounceIndex = -1;
    $scope.currentInfoWindow = null;
    $rootScope.currentBounceIndex = -1;

    $scope.updateMarkers = function () {
        var A = $scope.filteredPlaces;
        var pinList = [];
        angular.forEach(A, function (place) {
            pinList.push(place.name);
        });
        var B = $rootScope.places;
        var diff = B.filter(function (x) {
            return pinList.indexOf(x) < 0
        });
        for (var i = 0; i < B.length; i++) {
            var place = $rootScope.places[i];
            var index = diff.indexOf(place);
            if (index != -1) {
                $rootScope.markers[i].setMap(null);
            } else {
                $rootScope.markers[i].setMap($rootScope.map);
            }
        }
    };
    $scope.renderMap = function () {
        if ($routeParams.address != undefined || $routeParams.address != null) {
            var geoCodeLocationPromise = mapService.geoCodeLocation($routeParams.address);
            geoCodeLocationPromise.then(function (data) {
                $rootScope.map = mapService.displayMap(data.coordinates);
                mapService.setMarker(data.coordinates, $rootScope.map);
                renderPlaces($rootScope.map);
                $scope.currentInfoWindow = new google.maps.InfoWindow();
            });
        }
    };
    $scope.renderMap();
    var renderPlaces = function (map) {
        // code for restaurant
        var getRestaurantPromise = mapService.getRestaurants($routeParams.address);
        getRestaurantPromise.then(function (data) {
            processData(data, map);
        });
    };

    $scope.goTo = function () {
        $location.path('restaurants/' + $scope.inputAddress);
    };

    var processData = function (data, map) {
        var len = data.objects.length;
        var restaurants = data.objects;
        if (len > 13) {
            len = 13;
        }
        var places = [];
        var markers = [];
        var placeDescriptionList = [];
        var mapContent = {};
        for (var i = 0; i < len; i++) {
            var lat = restaurants[i].lat;
            var long = restaurants[i].long;
            var myLatLng = {lat: lat, lng: long};
            var marker = new google.maps.Marker({
                position: myLatLng
            });
            marker.placeName = restaurants[i].name;
            marker.addListener('click', function () {
                $scope.onClickRestaurant(this.placeName);
            });
            var placeDetails = {};
            placeDetails.website_url = restaurants[i].website_url;
            placeDetails.phone = restaurants[i].phone;
            placeDetails.id = restaurants[i].id;
            placeDetails.name = restaurants[i].name;
            placeDetails.street_address = restaurants[i].street_address;
            placeDescriptionList.push(placeDetails);
            marker.setMap(map);
            markers.push(marker);
            places.push(restaurants[i].name);
        }
        $rootScope.places = places;
        $rootScope.markers = markers;
        $rootScope.placeDescriptionList = placeDescriptionList;

        $rootScope.$apply(function () {
        });
        // mapContent.places = places;
        // mapContent.markers = markers;
        // mapContent.placeDescriptionList = placeDescriptionList;
        //
        // var latitude = 37.625732;
        // var longitude = -122.377807;
        // var partyLatitude = 37.785114;
        // var partyLongitude = -122.406677;
        // var uberServerToken = 'rPwzR5poT04qrH28gyDvX6zGf1Cx3IvZajTUpzwW';
        // var url = "http://api.uber.com/v1/estimates/price?";
        // url = url +  'start_latitude=' + latitude +  '&start_longitude=' + longitude +  '&end_latitude=' + partyLatitude + '&end_longitude='+ partyLongitude;
        // url = 'http://api.uber.com/v1/estimates/price?start_latitude=37.625732&start_longitude=-122.377807&end_latitude=37.785114&end_longitude=-122.406677&server_token=rPwzR5poT04qrH28gyDvX6zGf1Cx3IvZajTUpzwW';
        // console.log(document.domain);

        // $.ajax({
        //     url: "https://api.uber.com/v1/estimates/price",
        //     headers: {
        //         Authorization: "Token " + uberServerToken
        //     },
        //     data: {
        //         start_latitude: latitude,
        //         start_longitude: longitude,
        //         end_latitude: partyLatitude,
        //         end_longitude: partyLongitude,
        //         server_token : 'rPwzR5poT04qrH28gyDvX6zGf1Cx3IvZajTUpzwW'
        //     },
        //     success: function(result) {
        //         alert(JSON.stringify(result));
        //
        //         // 'results' is an object with a key containing an Array
        //         // var data = result["prices"];
        //         // if (typeof data != typeof undefined) {
        //         //     // Sort Uber products by time to the user's location
        //         //     data.sort(function(t0, t1) {
        //         //         return t0.duration - t1.duration;
        //         //     });
        //         //
        //         //     // Update the Uber button with the shortest time
        //         //     var shortest = data[0];
        //         //     if (typeof shortest != typeof undefined) {
        //         //         console.log("Updating time estimate...");
        //         //         $("#time").html("IN " + Math.ceil(shortest.duration / 60.0) + " MIN");
        //         //     }
        //         // }
        //     }
        // });

    };

    $scope.onClickRestaurant = function (placeName) {
        if (placeName === undefined || placeName === null) {
            placeName = this;
        }
        var index = -1;
        for (var i = 0; i < $rootScope.placeDescriptionList.length; i++) {
            if ($rootScope.placeDescriptionList[i].name === placeName) {
                index = i;
            }
        }
        $scope.animateMarker(index);
        $scope.displayInfoWindow(index);
    };

    $scope.animateMarker = function (index) {
        if (index != -1) {
            if ($scope.currentBounceIndex != -1) {
                $rootScope.markers[$scope.currentBounceIndex].setAnimation(null);
            }
            $scope.currentBounceIndex = index;
            $rootScope.markers[index].setAnimation(google.maps.Animation.BOUNCE);
            $scope.stopAnimation($rootScope.markers[index]);
        }
    };
    
    $scope.displayInfoWindow = function (index) {
        var content = "No Data Found";
        var marker = null;
        if (index != -1) {
            marker = $rootScope.markers[index];
            if ($scope.currentInfoWindow !== null) {
                $scope.currentInfoWindow.close();
            }
            var placeDetails = $rootScope.placeDescriptionList[index];
            content = "<div><b>" + placeDetails.name + "</b><hr><b> Website: <a target='_blank' href='" + placeDetails.website_url + ' \'>' + placeDetails.website_url + '</a> <br> Address: ' + placeDetails.street_address + '<br> Phone: ' + placeDetails.phone + "</b> </div>";
            $scope.currentInfoWindow.setContent(content);
            $scope.currentInfoWindow.open($rootScope.map, marker);
            $rootScope.map.setCenter(marker.getPosition());
            $scope.toggleList();
        }
    };

    $scope.stopAnimation = function (marker) {
        setTimeout(function () {
            marker.setAnimation(null);
        }, 1400);
    };
    
    $scope.toggleList = function () {
        if ($(window).width() < 600) {
            $('.collapseControl').css('display', 'block');
            $('.pin-panel').css('display', 'none');
        }
    }
});
