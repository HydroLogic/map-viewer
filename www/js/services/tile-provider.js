(function(){
    'use strict';

    var mod = angular.module('AngularApp.tiles', []);
    mod.provider('tile', function tileProvider(){

        var layers  = [];
        
        this.addLayer = function(layer){
            layers.push(layer);
        };

        this.$get = function(){
            return {
                layers : layers
            }
        };
        
    });

}());