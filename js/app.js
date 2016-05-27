"use strict";
var myApp = angular.module('myApp', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/restaurants/:address', {
                templateUrl: 'templates/restaurants.html',
                controller: 'restaurantController'
            })
            .when('/error', {templateUrl: 'templates/error.html', controller: 'errorController'})
            .otherwise({redirectTo: ''});
    }]);
