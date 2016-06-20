"use strict"
myApp.factory('uberService', function ($http, $q, $rootScope, $location) {

 var uberFactory = {};
    var uberServerToken = 'rPwzR5poT04qrH28gyDvX6zGf1Cx3IvZajTUpzwW';

    uberFactory.getFareEstimate = function (srcLatitude, srcLongitude, destLatitude, destLongitude) {

        return new Promise(function (resolve, reject) {
            var url = "https://api.uber.com/v1/estimates/price";
            $.ajax({
                url: url,
                headers: {
                    Authorization: "Token " + uberServerToken
                },
                data: {
                    start_latitude: srcLatitude,
                    start_longitude: srcLongitude,
                    end_latitude: destLatitude,
                    end_longitude: destLongitude,
                    server_token : uberServerToken
                }
            }).done(function (data) {
                return resolve(data);
            }).fail(function (jqXHR, textStatus) {
                return reject(textStatus);
            });
        });
    };
    return uberFactory;
});
