(function(){
    'use strict';

    var mod = angular.module('AngularApp');
    mod.controller('MapController', ['$scope', '$timeout', 'mapConfigService', 'editableVectors', 'tile',
        function($scope, $timeout, mapConfigService, editableVectors, tile){

        var options = {};
        $scope.mapState = {};

        var initMap = function(){
            mapConfigService.getMapConfig(options)
                .then(function(config){
                    var map = new ol.Map(config);
                    $scope.map = map;

                    //map.addLayer(editableVectors.drawTarget);
                    //map.addInteraction(editableVectors.drawInteraction);


                    //#todo: remove (raw debug purpose)
                    window.map = map;
                    prepareEvents();

                });
        };

        var prepareEvents  = function(){
            $scope.map.on('moveend',onMove )
        };

        var onMove = function(evt){
            var bounds = $scope.map.getView().calculateExtent($scope.map.getSize());
            var center = $scope.map.getView().getCenter();

            $timeout(function(){
                $scope.mapState.bounds = bounds; 
                $scope.mapState.center = center; 
            });
            
        }

        initMap();




    }]);
    

}());