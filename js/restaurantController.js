"use strict";
myApp.controller('restaurantController', function ($routeParams, $location, $scope, mapService, $rootScope) {

    $('.homePage').css('display', 'none');

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
                renderPlaces($rootScope.map, data.coordinates);
            });
        }
    };
    $scope.renderMap();
    var renderPlaces = function (map, coordinates) {
        var locationPromise = mapService.searchLocation(map, coordinates);
        locationPromise.then(function (data) {
            $rootScope.places = data.places;
            $rootScope.markers = data.markers;
            $rootScope.placeDescriptionList = data.placeDescriptionList;
        });
    };

    $rootScope.currentBounceIndex = -1;
    $scope.getContent = function (index) {
        if (index != -1) {
            if ($rootScope.currentBounceIndex != -1) {
                $rootScope.markers[$rootScope.currentBounceIndex].setAnimation(null);
            }
            $rootScope.currentBounceIndex = index;
            $rootScope.markers[index].setAnimation(google.maps.Animation.BOUNCE);

        }
    };
    $scope.goTo = function () {
        $location.path('restaurants/' + $scope.inputAddress);
    }
});