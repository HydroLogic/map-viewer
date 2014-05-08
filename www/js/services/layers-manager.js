(function(){
    'use strict';

    var mod = angular.module('AngularApp');
    mod.factory('layersManager', ['$rootScope',  'mapsManager', 'mapConfigService',  function($rootScope,mapsManager, mapConfigService){
        var layersForMaps = {};

        var getLayerFromConfig = function(l){
            var lyr = l.layer;
            lyr.set('name', l.name);
            if(l.group){
                lyr.set('group', l.group);
            }
            //lyr.extent = mapConfigService.extent;
            return lyr;
        };

        var getLayerByName = function(mapId, name){
            var layers = layersForMaps[mapId] || [];
            var container  = _.findWhere(layers, {name:name});
            if(container){
                return container.layer;
            }
            return null;
        };

        var getLayersByGroup = function(mapId, group){
            var layers = layersForMaps[mapId] || [];
            var containers = _.where(layers, {group:group});
            return _.pluck(containers, 'layer');
        };

        var getGroupComplement = function(mapId, name){
            var layers = layersForMaps[mapId] || [];
            var container  = _.findWhere(layers, {name:name});
            if(container.group){
                var containers = _.where(layers, {group:container.group});
                containers = _.reject(containers, function(item){ return item.name == name});
                return _.pluck(containers, 'layer' );
            }

        };

        var groupLayers = function(mapId){
            var layers = layersForMaps[mapId] || [];
            var doneGroups = [];
            var out = [];
            for(var i=0,n=layers.length;i<n;i++){
                 var l = layers[i];
                 var g = l.group;
                 var pos = doneGroups.indexOf(g)
                 if(pos!=-1){
                    out[pos].layers.push(l);
                 } else {
                    out.push({group:g, layers :[l]});
                    doneGroups.push(g);
                 }

            }

            return out;
        }


        var addLayer = function(mapId, layerConfig){
            layersForMaps[mapId] = layersForMaps[mapId] || [];
            layersForMaps[mapId].push(layerConfig);
            var lyr = getLayerFromConfig(layerConfig);
            mapsManager.maps[mapId].addLayer(lyr);
            var msg = 'layersChange.'+mapId;
            $rootScope.$broadcast(msg);
        };

        var removeLayer = function(mapId, layerConfig){
            var lyr = layerConfig.layer;
            mapsManager.maps[mapId].removeLayer(lyr);
            layersForMaps[mapId] = _.reject(layersForMaps[mapId], function(item){
                return item.name == layerConfig.name;
            })
            var msg = 'layersChange.'+mapId;
            $rootScope.$broadcast(msg);
        };


        var svc = {
            layersForMaps : layersForMaps,
            addLayer : addLayer,
            removeLayer : removeLayer,
            getLayerByName : getLayerByName,
            getLayersByGroup : getLayersByGroup,
            groupLayers : groupLayers,
            getGroupComplement : getGroupComplement
        };
        return svc;
    }]);
    

}());