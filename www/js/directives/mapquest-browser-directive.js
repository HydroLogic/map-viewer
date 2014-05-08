(function(){
    'use strict';

    var mod = angular.module('AngularApp');
    mod.directive('mapquestLayersBrowser', ['$rootScope','$timeout', function($rootScope,$timeout){
        return {

            restrict : 'C',
            templateUrl  : 'templates/osm-layers-browser.html',
            link : function(scope, element, attrs) {

                scope.layers = [
                    {
                        name : 'MapQuest OSM',
                        abstract : 'MapQuest OSM',
                        layer : new ol.layer.Tile({
                            source : new ol.source.MapQuest({layer:'osm'})
                        })

                    },
                    {
                        name : 'MapQuest Sat',
                        abstract : 'MapQuest Sat',
                        layer : new ol.layer.Tile({
                            source : new ol.source.MapQuest({layer:'sat'})
                        })

                    },
                    {
                        name : 'MapQuest Hybrid',
                        abstract : 'MapQuest Hybrid',
                        layer : new ol.layer.Tile({
                            source : new ol.source.MapQuest({layer:'hyb'})
                        })

                    },
                    
                    

                ];


                    

            }



        }


    }]);
    

}());