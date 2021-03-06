(function(){
    'use strict';

    angular.module('ngOL3Inmagik')
    .factory('mapConfigService', ['$q', 'layersConfigService', function($q, layersConfigService){

        //var extent = [-101335.5239627529,3874446.969545377,3276569.630015756,6298418.010524886] ;
        var center = [1587617.0530265016,5086432.490035132];

        var extent = ol.proj.transform([-180, -89.999, 180, 89.999], 'EPSG:4326', 'EPSG:3857'); 

        var getMapConfig = function(options){
            var deferred = $q.defer();
            var config = {
                target: 'map',
                view: new ol.View2D({
                  //center: ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857'),
                  //zoom: 4,
                  //center : [37.41, 8.82],
                  extent : extent
                }),
                extent : extent,
                //projection : 'EPSG:3857'
            };
            deferred.resolve(config);
            return deferred.promise;
        };

        var svc = {
            getMapConfig : getMapConfig,
            extent : extent
        };
        return svc;
    }]);
    

}());