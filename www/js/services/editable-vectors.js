(function(){
    'use strict';

    var mod = angular.module('AngularApp');
    mod.factory('editableVectors', [ function(){


        var drawSource = new ol.source.Vector();
        var drawTarget = new ol.layer.Vector({
          source: drawSource,
          style: new ol.style.Style({
            fill: new ol.style.Fill({
              color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
              color: '#ffcc33',
              width: 2
            }),
            image: new ol.style.Circle({
              radius: 7,
              fill: new ol.style.Fill({
                color: '#ffcc33'
              })
            })
          })
        });

        var drawInteraction = new ol.interaction.Draw({ type : 'Point', source:drawSource});

        var svc = {
            drawInteraction : drawInteraction,
            drawTarget : drawTarget,
            drawSource : drawSource
        };
        return svc;
    }]);
    

}());