(function(){
    'use strict';

    var angularApp = angular.module('AngularApp', ['ngRoute', 'ngAnimate', 'ngOL3Inmagik','AngularApp.tiles', 'ui.sortable']);


    angularApp.config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/map', {
                templateUrl: 'templates/map.html',
                controller: 'MapController'
            }).
    
            otherwise({
                redirectTo: '/map'
            });
        }
    ]);

    angularApp.config(['tileProvider', function(tileProvider) {
        tileProvider.addLayer([1]);

    }]);


    /* example configuration of http provider for cross origin requests */
    /*
    angularApp.config(['$httpProvider', function($httpProvider){
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }]);
    */

    
    // example interpolator configuration
    /*
    angularApp.config(function($interpolateProvider) {
        //$interpolateProvider.startSymbol('[{[');
        //$interpolateProvider.endSymbol(']}]');
    })
    */



}());