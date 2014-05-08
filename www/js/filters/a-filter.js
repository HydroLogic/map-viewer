(function(){
    'use strict';

    var mod = angular.module('AngularApp');
    mod.filter('aFilter', [ function(){
        return function(input, flag){
            if(flag){
                //... optional parameter
            }
            return input.toUpperCase();
        }
    }]);
    

}());