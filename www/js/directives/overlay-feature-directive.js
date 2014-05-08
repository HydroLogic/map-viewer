(function(){
    'use strict';

    var mod = angular.module('AngularApp');
    mod.directive('overlayFeature', [ function(){
        return {

            restrict : 'C',
            scope : {map:"=", feature:"="},
            templateUrl  : "templates/overlay-feature.html",
            link : function(scope, element, attrs) {
                
            


            }



        }


    }]);
    

}());