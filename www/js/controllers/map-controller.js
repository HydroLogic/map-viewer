(function(){
    'use strict';

    var mod = angular.module('AngularApp');
    mod.controller('MapController', ['$scope', '$timeout', 'mapConfigService', 'mapsManager', 'layersManager','layersConfigService', 'wmsBrowser',
        function($scope, $timeout, mapConfigService, mapsManager, layersManager, layersConfigService, wmsBrowser){

        var options = {};
        $scope.mapState = {};
        $scope.interfaceState = {
            addingLayer : false,
            layerType : null
        };

        //#TODO: move to service
        $scope.layerTypes  = [
            { name : 'wms repos', value : 'wms-repos' },
            { name : 'OpenStreetMap', value : 'osm' },
            { name : 'MapQuest', value : 'mapquest' },
            { name : 'OpenWeatherMap', value : 'openweathermap' },
        ];

        var initBrowser = function(){
            var url = 'map_resources/hillshade.xml'
            var urlBase = 'http://129.206.228.72/cached/hillshade'
            wmsBrowser.parseWMS(url, urlBase);
        };




        var initMap = function(){
            mapConfigService.getMapConfig(options)
                .then(function(config){
                    var map = mapsManager.createMap('main-map', config);
                    $scope.map = map;
                    layersManager.addLayer('main-map', layersConfigService.fixedLayers[0]);
                    
                    

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
        //initBrowser();

        $scope.addTest = function(){
            layersManager.addLayer('main-map', layersConfigService.fixedLayers[1]);
        };

        $scope.addTestWMS = function(layer){
            layersManager.addLayer('main-map', layer);
        };




    }]);
    

}());