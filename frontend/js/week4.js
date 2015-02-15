function artistsMap () {
    L.mapbox.accessToken = 'pk.eyJ1IjoiY3BlcnJpYXJkIiwiYSI6InN0UExhN28ifQ.GEm5rxAjECcgjIpy6pUY2g';
    var map = L.mapbox.map('artistsMap', 'cperriard.l7hpbn98')
        .setView([62.9, 15.6], 5);





    var myLayer = L.mapbox.featureLayer();

    myLayer.on('layeradd', function(e) {
        var marker = e.layer,
            feature = marker.feature,
            popupContent = "";

        // Create custom popup content
        if (feature.properties.place == "birth"){
            popupContent =  "" + feature.properties.title + " är född/uppvuxen/grundad här.";
        }
        if (feature.properties.place == "residence"){
            popupContent =  "" + feature.properties.title + " bor här.";
        }


        // http://leafletjs.com/reference.html#popup
        marker.bindPopup(popupContent,{
            closeButton: true,
        });

    });

    var markers = L.markerClusterGroup();

    $.getJSON('data/artists_locations.geojson', function(data){
        myLayer
            .setGeoJSON(data)
            .setFilter(function(feature) {
                return feature.properties.place == "birth";
            });

        markers.addLayer(myLayer);
        markers.addTo(map);
    });


    $("#birth").on("click", function(e){
        markers.removeLayer(myLayer);
        myLayer.setFilter(function(feature) {
            return feature.properties.place == "birth";
        });
        markers.addLayer(myLayer);
        return false;
    });

    $("#residence").on("click", function(e){
        markers.removeLayer(myLayer);
        myLayer.setFilter(function(feature) {
            return feature.properties.place == "residence";
        });
        markers.addLayer(myLayer);
        return false;
    });




}

artistsMap();