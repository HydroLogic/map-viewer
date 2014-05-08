(function(){
    'use strict';

    var mod = angular.module('AngularApp');
    mod.factory('wmsBrowser', ['$rootScope', function( $rootScope){

        var layers = [];

        var projection = new ol.proj.EPSG3857();
        var createLayerConfig = function(layer, url){
            var out= {
                name :layer.Name,
                abstract : layer.Abstract,
                xgroup : 'base',
                layer : new ol.layer.Tile({
                    source : new ol.source.TileWMS({
                        url : url,
                        params : {
                            'LAYERS' : layer.Name,
                            'FORMAT' : 'image/png',

                        },
                        crossOrigin: 'anonymous',
                        
                    })
                })
            }
            return out;
        };

        var updateLayers = function(layers, urlBase){
            var out = [];
            for(var i=0,n=layers.length;i<n;i++){
                var l = layers[i];
                var layerConfig = createLayerConfig(l, urlBase);
                out.push(layerConfig);
            }
            return out;
        }
        var parseWMS = function(url, urlBase){
            var parser = new ol.format.WMSCapabilities();
            $.ajax(url).then(function(response) {


                var result = parser.read(response);
                console.log("wms result", result);
                var serviceLayers = result.Capability.Layer.Layer;
                console.log("wms result", serviceLayers);
                svc.layers = updateLayers(serviceLayers, urlBase);
                console.log("processed layers.", svc.layers)
                $rootScope.$broadcast('wmsBrowserUpdate');

            });


        }
        var svc = {
            parseWMS : parseWMS,
            layers : layers

        };
        return svc;
    }]);
    

}());