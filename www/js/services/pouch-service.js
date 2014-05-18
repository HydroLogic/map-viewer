(function(){
    'use strict';

    var mod = angular.module('AngularApp');
    mod.factory('pouchService', [ '$q','offlineTiles' , 'mapConfigService', function($q, offlineTiles,mapConfigService){

        var createTileSource = function(layerId){


            return new ol.source.XYZ({
                /*
                tileUrlFunction : function(x,y,z){
                    var url = layerId + z+x+y;
                    return url;

                },
                */
                url : layerId+"/{z}/{x}/-{y}",
                tileLoadFunction: function(imageTile, src) {
                    console.log("loading", src);
                        getImageData(src).then(function(data){
                            console.log("xxx", data)
                            imageTile.getImage().src = data.data;
                        });

                        /*
                        window.setTimeout(function() {
                            imageTile.getImage().src = src;
                        }, 1);
                        */
                    }
                })
        }


        var getImageData = function(url){
                return offlineTiles.repo.images.get(url, {include_docs : true }, function(err,res){
                    console.log("oo", err, res)
                })

        };

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

        var createLayer = function(layerId, proj){
            var deferred = $q.defer();
            offlineTiles.repo.layers.get(layerId, {include_docs:true}).then(function(data){
                var source = createTileSource(layerId);
                var out= {
                    name :data.name + layerId,
                    extent : data.extent,
                    layer : new ol.layer.Tile({
                        source : source,
                        maxExtent : mapConfigService.extent,
                        projection : proj,
                        tileOrigin : data.tileOrigin,
                        displayOutsideMaxExtent : false
                    })
                };

                console.log("xxx", out)
                deferred.resolve(out);


            });

            return deferred.promise;

        };



        var svc = {

            createLayer : createLayer


        };
        return svc;
    }]);
    

}());