"use strict";
myApp.controller('homeController', function ($location, $scope, mapService, $rootScope) {

    $scope.goTo = function () {
        $rootScope.inputAddress = $scope.inputAddress;
        $('.homePage').css('display', 'none');
        $location.path('/restaurants/' + $scope.inputAddress);
    };

    $scope.loadPopularMap = function (city) {
        $('.homePage').css('display', 'none');
        $location.path('/restaurants/' + city);
    };
});
