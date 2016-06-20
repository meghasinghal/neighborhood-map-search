"use strict";
myApp.controller('restaurantController', function ($routeParams, $location, $scope, mapService, $rootScope, uberService) {

        $('.homePage').css('display', 'none');
        $scope.currentBounceIndex = -1;
        $scope.currentInfoWindow = null;
        $rootScope.currentBounceIndex = -1;
        $scope.centralCoordinates = null;

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
                    $scope.centralCoordinates = data.coordinates;
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

        $scope.onClickRestaurant = function (placeName) {
            if (placeName === undefined || placeName === null) {
                placeName = this;
            }
            var currLat = null;
            var currLong = null;
            var index = -1;
            for (var i = 0; i < $rootScope.placeDescriptionList.length; i++) {
                if ($rootScope.placeDescriptionList[i].name === placeName) {
                    index = i;
                    currLat = $rootScope.markers[index].position.lat();
                    currLong = $rootScope.markers[index].position.lng();
                }
            }

            $scope.animateMarker(index);
            var fareEstimatePromise = uberService.getFareEstimate($scope.centralCoordinates[0], $scope.centralCoordinates[1], currLat, currLong);
            fareEstimatePromise.then(function (data) {
                var data = data["prices"];
                if (typeof data != typeof undefined) {
                    data.sort(function (t0, t1) {
                        return t0.duration - t1.duration;
                    });
                    var shortest = data[0];
                    var fareData = {};
                    fareData.time = shortest.duration/60 + ' Mins';
                    fareData.fare = shortest.estimate;
                    fareData.distance = shortest.distance + " Miles";
                    $scope.displayInfoWindow(index, fareData);
                }
            });

            $scope.displayInfoWindow = function (index, fareData) {
                var content = "No Data Found";
                var marker = null;
                if (index != -1) {
                    marker = $rootScope.markers[index];
                    if ($scope.currentInfoWindow !== null) {
                        $scope.currentInfoWindow.close();
                    }
                    var placeDetails = $rootScope.placeDescriptionList[index];
                    content = "<div><b>" + placeDetails.name + "</b><hr><b> Website: <a target='_blank' href='" + placeDetails.website_url + ' \'>' + placeDetails.website_url + '</a> <br> Address: ' + placeDetails.street_address + '<br> Phone: ' + placeDetails.phone + "</b> </div>";
                    if (fareData != undefined || fareData != null) {
                        content = content + "<div> <hr> <b>UberDetails</b> <br> <br> <b> Estimated Time: </b>" + fareData.time + "<br> <b> Estimated Fare: </b>" + fareData.fare + "<br> <b> Estimated Distance: </b>" + fareData.distance + "</div>";
                    }
                }
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
    }
);
