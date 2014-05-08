        var getCapabilities = function(url){
            $.ajax({
                type: "GET",
                url: url,
                dataType: "xml",
                success: function(xml) {
                    $(xml).find('Layer').each(function(idx, it){
                        console.log("wow", it)
                    });
                }
            });
      
        };

        getCapabilities("map_resources/wms.jpl.nasa.gov.xml")
