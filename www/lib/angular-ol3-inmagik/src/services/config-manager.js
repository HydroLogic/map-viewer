(function(){
    'use strict';

    angular.module('ngOL3Inmagik')
    .factory('configManager', [ '$q', '$http', function($q, $http){

        var parseConfig = function(url){

            var d = $q.defer()

            $http.get(url).success(function(data){
                d.resolve(data);
            });


            return d.promise;

        };
        

        var svc = {
            parseConfig : parseConfig
        };
        return svc;
    }]);
    

}());