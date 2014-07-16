(function(){
    'use strict';

    var mod = angular.module('AngularApp');
    mod.controller('MapController', ['$scope', '$rootScope', '$timeout', 'mapConfigService', 'mapsManager', 'layersManager','layersConfigService', 'wmsBrowser', 'offlineTiles', 'pouchService',
        function($scope, $rootScope, $timeout, mapConfigService, mapsManager, layersManager, layersConfigService, wmsBrowser, offlineTiles, pouchService){

        var options = {};
        $scope.mapState = {};
        $scope.interfaceState = {
            addingLayer : false,
            layerType : null,
            layersPanel : false,
            geolocation : false,
            overlayInfo : true
        };

        //#TODO: move to service
        $scope.layerTypes  = [
            { name : 'wms repos', value : 'wms-repos' },
            { name : 'OpenStreetMap', value : 'osm' },
            { name : 'MapQuest', value : 'mapquest' },
            { name : 'OpenWeatherMap', value : 'openweathermap' },
        ];

        $scope.data = {}
        $scope.data.downloading = false;
        $scope.data.calculating = offlineTiles.downloading;
        $scope.data.currentDownloads = {};
        $scope.data.offlineLayers = [];


        $scope.toggleAdd = function(){
            $timeout(function(){
                $scope.interfaceState.addingLayer = !$scope.interfaceState.addingLayer;
            })
        };

        $scope.toggleLayersPanel = function(){
            $timeout(function(){
                $scope.interfaceState.layersPanel = !$scope.interfaceState.layersPanel;
            })
        };

        $scope.$on('toggleLayersPanel', function(evt,data){
            $scope.toggleLayersPanel();
        });

        $scope.toggleGeolocation = function(){
            $timeout(function(){
                $scope.interfaceState.geolocation = !$scope.interfaceState.geolocation;
                var txt = $scope.interfaceState.geolocation == true ? "on" : "off";
                alertify.success("Geolocation turned " + txt);
            })
        };

        $scope.downloadTiles = function(){
            setTimeout(function(){
                offlineTiles.downloadTileLayers($scope.map.getLayers());    
            }, 0)
            
        }
        

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
                    map.getView().fitExtent(mapConfigService.extent, map.getSize() );
                    map.getView().setZoom(3)
                    
                    
                    

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
            var v = $scope.map.getView();
            var bounds = v.calculateExtent($scope.map.getSize());
            var bounds4326 = ol.proj.transform(bounds, 'EPSG:3857','EPSG:4326')
            var center = v.getCenter();
            var zoom = v.getZoom();

            $timeout(function(){
                $scope.mapState.bounds = bounds; 
                $scope.mapState.bounds4326 = bounds4326; 
                $scope.mapState.center = center; 
                $scope.mapState.zoom = zoom;
                $scope.mapState.width = (bounds[2] - bounds[0]) / 1000; 
                $scope.mapState.height = (bounds[3] - bounds[1]) / 1000; 

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


        $scope.loadOffline = function(id){
            pouchService.createLayer(id, $scope.map.getView().getProjection()).then(function(layerConfig){
                layersManager.addLayer('main-map', layerConfig);     

                $scope.map.getView().fitExtent(layerConfig.extent, $scope.map.getSize()) 
            });
        }


        $scope.$watch(function(){
            return offlineTiles.currentDownloads
        }, function(nv){
            //console.log("-currentDownloads",nv)    
            $timeout(function(){
                $scope.data.currentDownloads = nv;
            })
            

        }, true)


        $scope.$watch(function(){
            return offlineTiles.downloading
        }, function(nv){
            console.log("-downloading",nv)    
            $timeout(function(){
                $scope.data.downloading = nv;
            })
            

        }, true)


         

        $scope.$watch(function(){
            return offlineTiles.calculating;
        }, function(nv){
            console.log("--xx---",nv)    
            $timeout(function(){
                $scope.data.calculating = nv;
            })
            

        }, true)


        $scope.$on('ooo', function(evt, data){
            console.log("ee", data);
             $timeout(function(){
                $scope.data.offlineLayers = data;
            });
        })




    }]);
    

}());