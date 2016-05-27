"use strict";
myApp.controller('errorController', function ($scope, $location) {

    $scope.goToHomePage = function () {
        $('.homePage').css('display', 'block');
        $location.path('/');
    }
});