"use strict";
myApp.factory('mapService', function ($http, $q, $rootScope, $location) {
    var mapFactory = {};
    mapFactory.geoCodeLocation = function (address) {
        var deferred = $q.defer();
        var coordinates = [];
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                coordinates.push(results[0].geometry.location.lat());
                coordinates.push(results[0].geometry.location.lng());
                $rootScope.$apply(deferred.resolve({coordinates: coordinates}));
            } else {
                deferred.reject(status);
                $location.path('/error');
                $rootScope.$apply(deferred.reject({coordinates: status}));
            }
        });
        return deferred.promise;
    };

    mapFactory.displayMap = function (coordinates) {
        var mapProp = {
            center: new google.maps.LatLng(coordinates[0], coordinates[1]),
            zoom: 15
        };
        return new google.maps.Map(document.getElementById("googleMap"), mapProp);
    };

    mapFactory.setMarker = function (coordinates, map) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(coordinates[0], coordinates[1])
        });

        marker.setMap(map);
    };

    mapFactory.searchLocation = function (map, coordinates) {
        var request = {
            location: new google.maps.LatLng(coordinates[0], coordinates[1]),
            radius: '1500',
            types: ['restaurant']
        };
        var deferred = $q.defer();
        var service = new google.maps.places.PlacesService(map);
        var places = [];
        var markers = [];
        var placeDescriptionList = [];
        service.nearbySearch(request, function (results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    var place = results[i];
                    places.push(place.name);
                    placeDescriptionList.push(place);
                    var marker = new google.maps.Marker({
                        position: place.geometry.location
                    });
                    marker.setMap(map);
                    markers.push(marker);
                }
                $rootScope.$apply(deferred.resolve({
                    places: places,
                    markers: markers,
                    placeDescriptionList: placeDescriptionList
                }));
            } else {
                $rootScope.$apply(deferred.reject("error"));
            }
        });
        return deferred.promise;
    };
    return mapFactory;
});