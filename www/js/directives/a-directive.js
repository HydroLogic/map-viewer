(function(){
    'use strict';

    var mod = angular.module('AngularApp');
    mod.directive('aDirective', [ function(){
        return {

            restrict : 'A',
            template  : "<div>Example directive</div>",
            link : function(scope, element, attrs) {}



        }


    }]);
    

}());