(function(){
    'use strict';

    var mod = angular.module('AngularApp');
    mod.directive('openweathermapLayersBrowser', ['$rootScope','$timeout', function($rootScope,$timeout){
        return {

            restrict : 'C',
            templateUrl  : 'templates/osm-layers-browser.html',
            link : function(scope, element, attrs) {

                
                var createLayer = function(layerName){
                    return {
                        name : 'OpenWheatherMap ' + layerName,
                        layer : new ol.layer.Tile({
                            source : new ol.source.XYZ({
                                url : 'http://{a-c}.tile.openweathermap.org/map/'+layerName+'/{z}/{x}/{y}.png',
                                
                            })
                        })
                    }
                };

                var layers = [];
                var layerNames = ['clouds', 'clouds_cls', 'precipitation', 'precipitation_cls', 'radar'];

                for(var i =0,n=layerNames.length;i<n;i++){
                    var l = createLayer(layerNames[i]);
                    layers.push(l);
                }

                
                scope.layers = layers;    
                
                


                    

            }



        }


    }]);
    

}());