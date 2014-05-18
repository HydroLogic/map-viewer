(function(){
    'use strict';

    var mod = angular.module('AngularApp');
    mod.factory('offlineTiles', ['$q', '$rootScope', function($q, $rootScope){

        
        var downloading = false;
        var layersToDownload = [];
        var offlineLayers = [];
        var currentDownloads = {};
        var calculating = [];
        
        var queue = {
            layers : new PouchDB('qLayers'),
            images : new PouchDB('qImages')
        };

        var repo = {
            layers : new PouchDB('repoLayers'),
            images : new PouchDB('repoImages')
        };

        var resetDb = function(db){
            //console.log("ss",db)
            db.allDocs({include_docs:true}, function(e, r){
                //console.log("x", e, r)
                _.each(r.rows, function(item){
                    db.remove(item.doc, function(err,res){
                        //console.log(2, err, res)
                    })
                })
                
                
            }).then(function(){console.log("aaa")});

        }
        //reset queue
        _.each(queue, function(item){
            resetDb(item);
        });

        //reset repo
        _.each(repo, function(item){
            //resetDb(item);
        });


        
        var forcePut = function(db, doc, cb){
            return db.get(doc._id).then(function (origDoc) {
                doc._rev = origDoc._rev;
                return db.put(doc,cb);
            }, function () {
                return db.put(doc,cb);
            });
        };

        var generateUid = function () {
            // Math.random should be unique because of its seeding algorithm.
            // Convert it to base 36 (numbers + letters), and grab the first 9 characters
            // after the decimal.
            return 'U' + Math.random().toString(36).substr(2, 9);
        };



        var changes = repo.layers.changes({
            //since: 20,
            live: true
        }).on('change', function(change) { 
            console.error("layer changed", change);
            //we could probably apply a diff...
            repo.layers.allDocs({ include_docs:true }).then(function(data){
                var d = _.pluck(data.rows, 'doc');
                //console.log("new data:", data,d);

                offlineLayers = d;
                $rootScope.$broadcast('ooo', d);
            })
        });


        var queueLayer = function(layerData){
            var deferred = $q.defer();
            console.log("queuing", layerData);
            //pushing layer
            forcePut(queue.layers, layerData).then(function(res){
                queue.images.bulkDocs(layerData.urls, function(err, res){
                    if(err){
                        console.error(err)
                        deferred.reject(err);
                    } else {
                        deferred.resolve(layerData);
                    }

                });
            });
            
            return deferred.promise;
        };


        var queueLayers = function(layersData){
            var deferred = $q.defer();
            var layers = {};
            _.each(layersData, function(item){
                layers[item._id] = queueLayer(item).then(function(data){
                    delete layers[data._id];
                    for(var l in layers){
                        return;
                    }
                    deferred.resolve(_.pluck(layersData, '_id'));

                });
            });
            
            return deferred.promise;

        };


        var addLayersToDownload  = function(layers){
            var deferred = $q.defer();
            db.bulkDocs(layers, function(err, result){
                if(!err){
                    console.log("written!", result);
                    deferred.resolve(result);
                } else {
                    console.log("Error writing", layers, err);
                }
            });
            return deferred.promise;
        };

        var saveImageToPouch = function(key, url, data){
            //console.log(key,url,data)
            var deferred = $q.defer();
            var obj = {
                _id : url,
                data : data
            }



            forcePut(repo.images, obj, function(err, result){
                if(!err){
                    //console.log("written!", result);
                    queue.images.get(key).then(function(doc){
                        queue.images.remove(doc, function(err,r){
                            deferred.resolve(key);    
                        });
                    });

                } else {
                    console.log("Error writing to images", obj, err);
                    queue.images.get(key).then(function(doc){
                        queue.images.remove(doc, function(err,r){
                            deferred.resolve(key);    
                        });
                    });
                }
            });
            return deferred.promise;
        }


        var updateCacheStatusMessage = function(a, b, c){
            console.log("update",a,b,c);
        };


        var getLayersToDownload = function(){
            var deferred = $q.defer();

            db.allDocs({include_docs: true, descending: true}, function(err, response) {

                var out = _.pluck(response.rows, 'doc');
                deferred.resolve(out);
            });

            return deferred.promise;
        };


        var saveLayerToRepo = function(layer){
            console.log("saving layer to repo!", layer);
            delete layer.urls;
            forcePut(repo.layers, layer).then(function(data){
                console.log("layer saved!", data);
            })
        };

         


        var checkLayerFinished = function(id){
            //console.log("checj", id)
            var deferred = $q.defer();
            
                
            queue.images.query(function(doc, emit) {
                if (doc.layerId === id) {
                        emit(doc);
                    }
                }, function(err, results) { 

                    if(err){
                        console.error(err)
                    } else {
                        
                        if(results.total_rows == 0){
                           //console.log("rev", id)
                        
                            queue.layers.get(id).then(function(doc) {
                                queue.layers.remove(doc).then(function(){
                                    console.log("removed layer", id);
                                    deferred.resolve(true)
                            });
                            
                        });
                        
                    }
                    deferred.resolve(false);
                }
            });
            return deferred.promise;
            
        };

        

        var checkCurrentDownloads = function(id){
            var d = currentDownloads[id];
            
            
            if(d)return;
            
            delete currentDownloads[id];
            queue.layers.get(id).then(function(doc) {
                queue.layers.remove(doc).then(function(){
                    //console.log("removed layer", id);
                    //delete svc.currentDownloads[id];
                    saveLayerToRepo(doc).then(function(data){
                        for(var x in currentDownloads){
                            if(currentDownloads[x]) return;
                        }
                        downloading = false;
                    });

                    
                });

            });
        }

        var startDowloads = function(){
            downloading = true;
            

            queue.layers.allDocs({include_docs:true}, function(err, resp){
                var layers = resp.rows;
                //console.log("x", layers);
                for(var k=0,n=layers.length;k<n;k++){
                    var layer = layers[k];
                    var layerId = layer.id;
                    currentDownloads[layerId] = currentDownloads[layerId] || 0;
                    queue.images.query(function(doc, emit){
                        
                        if(doc.layerId == layerId){
                            emit(doc);
                        }

                    }, 
                    {include_docs:true},
                    function(err,res){
                        _.each(res.rows, function(im){
                            if(!downloading){
                                return;
                            }
                            //console.log("d",im.doc)
                            var url = im.doc.url;
                            //currentDownloads[im.doc.layerId][url] = true;
                            currentDownloads[im.doc.layerId] += 1;

                            downloadImage(im.doc.url)
                            .then(function(dd){
                                //console.log("dd", dd)
                                var imageId = im.doc.layerId + "/" +  im.doc.z + "/" +im.doc.x + "/" +im.doc.y;
                                //var imageId = im.doc._id;
                                saveImageToPouch(im.doc._id, imageId, dd.data).then(function(id){
                                     //checkLayerFinished(id)    
                                     //console.log("id saved!")
                                     //delete svc.currentDownloads[layerId][dd.url];
                                     currentDownloads[im.doc.layerId] -= 1;
                                     //console.log("sssss", currentDownloads);
                                     //console.log("missing", currentDownloads[layerId]);
                                     checkCurrentDownloads(im.doc.layerId)

                                     
                                     
                                });
                            })

                        });

                    });



                }

            });

            return;
        };

        var stopDownloads = function(){
            downloading = false;
        };


        var downloadImage = function(tileUrl){
            var deferred = $q.defer();
            //console.log("downloading tile", tileUrl)
            var img = document.createElement('img');
            // When the image is loaded, add it to the localStorage
            img.onload = function() {
                //console.log("z", this)
                var context = ol.dom.createCanvasContext2D(256,256);
                context.drawImage(this, 0, 0);
                var data = context.canvas.toDataURL('image/png');
                deferred.resolve({data:data, url:tileUrl});
                
            };
            
            img.crossOrigin = 'anonymous';
            img.src =  tileUrl;
            return deferred.promise;
            

        };






        var downloadTileLayers = function(layers){
            console.log("Downloading tiles", map);
            var isStorageFull = false;
            var nbTilesCached = 0;
            var nbTilesTotal = 0;
            var size = map.getSize();
            var view = map.getView();
            var initialZoom = view.getZoom();
            var projection = view.getView2D().getProjection();
            var extent = view.calculateExtent(size);

            
            layers.forEach(function(layer) {
                var source = layer.getSource();
                
                
                if (source instanceof ol.source.TileImage) {
                    

                    //var tileGrid = source.getTileGrid();
                    //var tileGrid = source.getTileGrid() || source.getTileGridForProjection(projection);
                    var tileGrid = source.getTileGridForProjection(projection);
                    
                    //var tileSize = tileGrid.getTileSize(z);
                    //var tileOrigin = tileGrid.origin;
                    

                    var uid = generateUid();//layer.get('uid');
                    calculating.push(uid);
                    $rootScope.$apply();
                    //console.log("calculating", uid, calculating)
                    var name = layer.get('name');
                    //var uniqueId = generateUid()
                    var l = {_id:uid, uid:uid, name:name, extent:extent, urls : []};
                    
                    var tileUrlFunction = source.tileUrlFunction;
                    //for (var z = initialZoom; z <= tileGrid.maxZoom && !isStorageFull; z++) {
                    for (var z = initialZoom; z < initialZoom+1; z++) {
                    
                        // Get the ranges of tiles to save
                        var tileRange = tileGrid.getTileRangeForExtentAndZ(extent, z);
                        console.log("xxx", tileRange)
                        for (var x = tileRange.minX; x <= tileRange.maxX && !isStorageFull; x++) {
                            for (var y = tileRange.minY; y <= tileRange.maxY && !isStorageFull; y++) {
                                var tileUrl = tileUrlFunction(new ol.TileCoord(z, x, y), ol.BrowserFeature.DEVICE_PIXEL_RATIO, projection);
                                
                                var doc = {_id:uid+tileUrl, layerId : l._id, url:tileUrl, x:x,y:y+1,z:z};
                                l.urls.push(doc);
                                //dbTilesToDownload.put(doc);
                                
                            } // y loops
                        } // x loop 
                    } // ZOOM loop
                    layersToDownload.push(l);
                    var idx = calculating.indexOf(uid);
                    calculating.splice(idx, 1);
                    //console.log("calculating end", uid, calculating)
                    
                } //
            }); //layers loop

            queueLayers(layersToDownload).then(function(data){
                console.log("layers queued", data);
                startDowloads()
                
            })
            
            /*
            addLayersToDownload(layersToDownload).then(function(){
                startDowloads();    
            })
            */
            
            
        };

        var getCalculating = function(){
            return calculating;
        }



        var svc = {
            downloadTileLayers : downloadTileLayers,
            currentDownloads : currentDownloads,
            downloading : downloading,
            getCalculating : getCalculating,
            offlineLayers : offlineLayers,
            repo : repo
        };
        
        return svc;
    }]);
    

}());