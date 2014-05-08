(function(){
    'use strict';

    var mod = angular.module('AngularApp');
    mod.directive('layerSwitcher', ['$rootScope','layersManager', function($rootScope, layersManager){
        return {

            restrict : 'C',
            scope : {mapId:"@"},
            templateUrl  : "templates/layer-switcher.html",
            link : function(scope, element, attrs) {
                
                if(!scope.mapId){
                    return;
                }

                

                var refresh = function(){
                    scope.groupedLayers = layersManager.groupLayers(scope.mapId);
                    if(attrs.groups){
                        var allowedGroups = attrs.groups.split(",");
                        scope.groupedLayers = _.reject(scope.groupedLayers, function(item){
                            return allowedGroups.indexOf(item.group) == -1;
                        })
                    }
                    
                    scope.groupedValues  = {};
                    scope.ungroupedValues = {};
                    
                    _.each(scope.groupedLayers, function(item){
                        if(item.group){
                            var l = item.layers.length;
                            scope.groupedValues[item.group] = item.layers[l-1].name;
                        } else {
                            _.each(item.layers, function(l){
                                scope.ungroupedValues[l.name] = l.layer.getVisible();
                            })
                        }
                    });

                };

                var msg = 'layersChange.'+scope.mapId;
                $rootScope.$on(msg, function(evt,data){
                    refresh();
                });

                refresh();

                
                scope.setVisible = function(layerContainer){
                    
                    if(layerContainer.group){
                        var complements = layersManager.getGroupComplement(scope.mapId,layerContainer.name);
                        _.each(complements, function(item){
                            item.setVisible(false);
                        })
                        layerContainer.layer.setVisible(true);

                    } else {
                        var l = layerContainer.layer;
                        l.setVisible(!(l.getVisible()));
                    }
                };

                scope.removeLayer = function(layerContainer){
                    layersManager.removeLayer(scope.mapId, layerContainer);
                }

            }



        }


    }]);
    

}());