function artistsMap () {
    L.mapbox.accessToken = 'pk.eyJ1IjoiY3BlcnJpYXJkIiwiYSI6InN0UExhN28ifQ.GEm5rxAjECcgjIpy6pUY2g';
    var map = L.mapbox.map('artistsMap', 'cperriard.l7hpbn98', {maxZoom: 14})
        .setView([62.9, 15.6], 5);




    var cluster = new PruneClusterForLeaflet(80, 10);




    cluster.BuildLeafletClusterIcon = function(cluster) {
        var e = new L.Icon.MarkerCluster();

        e.stats = cluster.stats;
        e.population = cluster.population;
        return e;
    };

    var colors = [ 'black', '#e70074', '#00bbdb', 'grey'],
        pi2 = Math.PI * 2;

    L.Icon.MarkerCluster = L.Icon.extend({
        options: {
            iconSize: new L.Point(44, 44),
            className: 'prunecluster leaflet-markercluster-icon'
        },

        createIcon: function () {
            // based on L.Icon.Canvas from shramov/leaflet-plugins (BSD licence)
            var e = document.createElement('canvas');
            this._setIconStyles(e, 'icon');
            var s = this.options.iconSize;
            e.width = s.x;
            e.height = s.y;
            this.draw(e.getContext('2d'), s.x, s.y);
            return e;
        },

        createShadow: function () {
            return null;
        },

        draw: function(canvas, width, height) {

            var lol = 0;

            var start = 0;
            for (var i = 0, l = colors.length; i < l; ++i) {

                var size = this.stats[i] / this.population;


                if (size > 0) {
                    canvas.beginPath();
                    canvas.moveTo(22, 22);
                    canvas.fillStyle = colors[i];
                    var offset = 0.14;
                    if (size == 1){
                        offset = 0;
                    }

                    var from = start + offset,
                        to = start + size * pi2;

                    if (to < from) {
                        from = start;
                    }
                    canvas.arc(22,22,22, from, to);

                    start = start + size*pi2;
                    canvas.lineTo(22,22);
                    canvas.fill();
                    canvas.closePath();
                }

            }

            canvas.beginPath();
            canvas.fillStyle = 'white';
            canvas.arc(22, 22, 18, 0, Math.PI*2);
            canvas.fill();
            canvas.closePath();

            canvas.fillStyle = '#555';
            canvas.textAlign = 'center';
            canvas.textBaseline = 'middle';
            canvas.font = 'bold 12px sans-serif';

            canvas.fillText(this.population, 22, 22, 40);
        }
    });

    map.addLayer(cluster);


    $.getJSON('data/artists.json', function(data){
        var marker, lat, lon,
            weight = 1,
            cityweight = 100;
        for ( var i = 0; i < data.length; i++ ) {
            if (data[i].birth_lat) {
                lat = data[i].birth_lat;
                lon = data[i].birth_lon;
                if (data[i].nearest_birth_distance == 0) {
                    weight = cityweight;
                }
            } else {
                lat = data[i].res_lat;
                lon = data[i].res_lon;
                if (data[i].nearest_res_distance == 0) {
                    weight = cityweight;
                }
            }
            marker = new PruneCluster.Marker( lat, lon );
            marker.category = data[i].gender;
            marker.weight = weight;
            marker.data.popup = data[i].artist;

            if (data[i].res_lat) {
                marker.data.res_lat = data[i].res_lat;
                marker.data.res_lon = data[i].res_lon;
                marker.data.nearest_res_distance = data[i].nearest_res_distance;
            }
            if (data[i].birth_lat) {
                marker.data.birth_lat = data[i].birth_lat;
                marker.data.birth_lon = data[i].birth_lon;
                marker.data.nearest_birth_distance = data[i].nearest_birth_distance;
            }
            marker.data.delta_lat = data[i].delta_lat;
            marker.data.delta_lon = data[i].delta_lon;

            if (data[i].age){
                marker.data.age = data[i].age;
            }

            var markerColor = "#808080";
            if (data[i].gender == 1){
                markerColor = "#e70074";
            } else if (data[i].gender == 2){
                markerColor = "#00bbdb";
            }

            marker.data.icon = L.mapbox.marker.icon({
                'marker-color': markerColor
            });


            cluster.RegisterMarker(marker);
        }

        cluster.ProcessView();

        var timerId,
            step = 0.001;



        $("#artists_residence").on("click", function(e){
            $(this).toggleClass("artistsToggleActive");
            $("#artists_birth").toggleClass("artistsToggleActive");
            var exitInterval = true;
            clearInterval(timerId);
            timerId = window.setInterval(function () {
                var markers = cluster.Cluster._markers;
                for (var i = 0; i < markers.length; i++ ){
                    if ( markers[i].data.delta_lat > 0 ) {
                        if (markers[i].position.lat < markers[i].data.res_lat * Math.sign(markers[i].data.delta_lat) ){
                            markers[i].weight = 1;

                            markers[i].position.lat += step * markers[i].data.delta_lat;
                            markers[i].position.lng += step * markers[i].data.delta_lon;
                            exitInterval = false;
                        } else {
                            markers[i].position.lat = markers[i].data.res_lat;
                            markers[i].position.lng = markers[i].data.res_lon;
                            if (markers[i].data.nearest_res_distance == 0){
                                markers[i].weight = cityweight;
                            }
                        }
                    }
                }

                cluster.ProcessView();
                if (exitInterval) {
                    clearInterval(timerId);
                }
                exitInterval = true;
            }, 1);
        });

        $("#artists_birth").on("click", function(e){
            $(this).toggleClass("artistsToggleActive");
            $("#artists_residence").toggleClass("artistsToggleActive");
            var exitInterval = true;
            clearInterval(timerId);
            timerId = window.setInterval(function () {
                var markers = cluster.Cluster._markers;
                for (var i = 0; i < markers.length; i++ ){
                    if ( markers[i].data.delta_lat > 0 ) {
                        if (markers[i].position.lat > markers[i].data.birth_lat * Math.sign(markers[i].data.delta_lat) ){
                            markers[i].weight = 1;
                            markers[i].position.lat -= step * markers[i].data.delta_lat;
                            markers[i].position.lng -= step * markers[i].data.delta_lon;
                            exitInterval = false;
                        } else {
                            markers[i].position.lat = markers[i].data.birth_lat;
                            markers[i].position.lng = markers[i].data.birth_lon;
                            if (markers[i].data.nearest_birth_distance == 0){
                                markers[i].weight = cityweight;
                            }
                        }
                    }
                }

                cluster.ProcessView();
                if (exitInterval) {
                    clearInterval(timerId);
                }
                exitInterval = true;
            }, 1);
        });


        var showMen = true,
            showFemale = true,
            showBands = true;

        $("#artists_men").on("click", function(e){
            var $this = $(this);
            if( $this.hasClass("artistsToggleActive")) {
                showMen = false;
            } else {
                showMen = true;
            }
            $this.toggleClass("artistsToggleActive");
            var markers = cluster.Cluster._markers,
                bounds = $("#range-age").val().split(","),
                age;
            for (var i = 0; i < markers.length; i++ ){
                age = markers[i].data.age;
                if ( markers[i].category == 2 && age >= bounds[0] && age <= bounds[1] ) {
                    markers[i].filtered = !showMen;
                }
            }
            cluster.ProcessView();

        });

        $("#artists_female").on("click", function(e){
            var $this = $(this);
            if( $this.hasClass("artistsToggleActive")) {
                showFemale = false;
            } else {
                showFemale = true;
            }
            $this.toggleClass("artistsToggleActive");
            var markers = cluster.Cluster._markers,
                bounds = $("#range-age").val().split(","),
                age;
            for (var i = 0; i < markers.length; i++ ){
                age = markers[i].data.age;
                if ( markers[i].category == 1 && age >= bounds[0] && age <= bounds[1] ) {
                    markers[i].filtered = !showFemale;
                }
            }
            cluster.ProcessView();

        });

        $("#artists_bands").on("click", function(e){
            var $this = $(this);
            if( $this.hasClass("artistsToggleActive")) {
                showBands = false;
            } else {
                showBands = true;
            }
            $this.toggleClass("artistsToggleActive");
            var markers = cluster.Cluster._markers,
                bounds = $("#range-age").val().split(","),
                age;
            for (var i = 0; i < markers.length; i++ ){
                age = markers[i].data.age;
                if ( markers[i].category == 3 && age >= bounds[0] && age <= bounds[1] ) {
                    markers[i].filtered = !showBands;
                }
            }
            cluster.ProcessView();

        });

        $("#range-age").slider({
            tooltip: 'always'
        }).on("change input", function(e){

            var bounds = $(this).val().split(","),
                markers = cluster.Cluster._markers,
                age;

            for (var i = 0; i < markers.length; i++ ){
                age = markers[i].data.age;
                if ( age >= bounds[0] && age <= bounds[1] ) {
                    markers[i].filtered = false;
                    if (markers[i].category == 3 && !showBands) {
                        markers[i].filtered = true;
                    }
                    if (markers[i].category == 2 && !showMen) {
                        markers[i].filtered = true;
                    }
                    if (markers[i].category == 1 && !showFemale) {
                        markers[i].filtered = true;
                    }
                } else {

                        markers[i].filtered = true;

                }
            }
            cluster.ProcessView();

        });



    });











}

function week4(){
    artistsMap();
}
