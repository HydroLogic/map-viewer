(function(){
    'use strict';

    var mod = angular.module('AngularApp');
    mod.directive('osmLayersBrowser', ['$rootScope','$timeout', function($rootScope,$timeout){
        return {

            restrict : 'C',
            templateUrl  : 'templates/osm-layers-browser.html',
            link : function(scope, element, attrs) {

                scope.layers = [
                    {
                        name : 'OSM',
                        abstract : 'OpenStreetMap',
                        layer : new ol.layer.Tile({
                            source : new ol.source.OSM()
                        })

                    },
                    {
                        name : 'opencyclemap',
                        abstract : 'OpenStreetMap opencyclemap',
                        layer : new ol.layer.Tile({
                            source : new ol.source.OSM({
                                url: 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
                            })
                        })

                    },
                    {
                        name : 'opencyclemap transport',
                        abstract : 'OpenStreetMap opencyclemap transport',
                        layer : new ol.layer.Tile({
                            source : new ol.source.OSM({
                                url: 'http://{a-b}.tile2.opencyclemap.org/cycle/{z}/{x}/{y}.png'
                            })
                        })

                    },

                    {
                        name : 'OSM BW',
                        abstract : 'OpenStreetMap BW',
                        layer : new ol.layer.Tile({
                            source : new ol.source.OSM({
                                url: 'http://{a-b}.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png'
                            })
                        })

                    },
                    {
                        name : 'Hillshading',
                        abstract : 'OpenStreetMap Hillshading',
                        layer : new ol.layer.Tile({
                            source : new ol.source.OSM({
                                url: 'http://{a-b}.toolserver.org/~cmarqu/hill/{z}/{x}/{y}.png'
                            })
                        })

                    },
                    

                    
                    {
                        name : 'openptmap',
                        abstract : 'OpenStreetMap openptmap',
                        layer : new ol.layer.Tile({
                            source : new ol.source.OSM({
                                url: 'http://www.openptmap.org/tiles/{z}/{x}/{y}.png'
                            })
                        })

                    },
                    {
                        name : 'Toner',
                        abstract : 'Stamen Toner ',
                        layer : new ol.layer.Tile({
                            source : new ol.source.Stamen({
                                layer : 'toner'
                            })
                        })

                    },
                    {
                        name : 'stamen-terrain',
                        abstract : 'Stamen Terrain',
                        layer : new ol.layer.Tile({
                            source : new ol.source.Stamen({
                                layer : 'terrain'
                            })
                        })

                    },
                    {
                        name : 'stamen-watercolor',
                        abstract : 'Stamen Watercolor ',
                        layer : new ol.layer.Tile({
                            source : new ol.source.Stamen({
                                layer : 'watercolor'
                            })
                        })

                    },
                    

                ];


                    

            }



        }


    }]);
    

}());