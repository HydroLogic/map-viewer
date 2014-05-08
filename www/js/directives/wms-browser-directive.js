(function(){
    'use strict';

    var mod = angular.module('AngularApp');
    mod.directive('wmsLayersBrowser', ['$rootScope','$timeout' , 'wmsBrowser', function($rootScope,$timeout, wmsBrowser){
        return {

            restrict : 'C',
            templateUrl  : 'templates/wms-layers-browser.html',
            link : function(scope, element, attrs) {

                scope.layers = wmsBrowser.layers;
                scope.configObj = null;

                scope.availableObjs = [
                    {
                        url : 'map_resources/nowcoast.noaa.gov.xml',
                        urlBase : 'http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/obs?service=wms'

                    },

                    {
                        url : 'map_resources/demo.opengeo.org.xml',
                        urlBase : 'http://demo.opengeo.org/geoserver/wms'

                    },
                    {
                        url : 'map_resources/wms.pcn.minambiente.it.xml',
                        urlBase : 'http://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_v1.3/Vettoriali/Corine_Land_Cover2006_IVliv.map&service=wms'

                    },
                    
                    {
                        url : 'map_resources/dem_hillshades_mosaic.xml',
                        urlBase : 'http://maps.ngdc.noaa.gov/arcgis/services/web_mercator/dem_hillshades_mosaic/MapServer/WMSServer'

                    },
                    {
                        url : 'map_resources/forecasts.nowcoast.noaa.gov.xml',
                        urlBase : 'http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/forecasts?service=wms'
                    },
                    {
                        url : 'map_resources/obs.nowcoast.noaa.gov.xml',
                        urlBase : 'http://nowcoast.noaa.gov/wms/com.esri.wms.Esrimap/obs?service=wms'
                    }

                    
                    
                ]

                scope.$watch('configObj', function(nv){
                    if(!nv) return;
                    wmsBrowser.parseWMS(nv.url, nv.urlBase);
                })

            
            

                $rootScope.$on('wmsBrowserUpdate', function(){
                    $timeout(function(){
                        scope.layers = wmsBrowser.layers;    
                    })
                    
                    console.log("sssss")
                });
                    

            }



        }


    }]);
    

}());