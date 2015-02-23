function artistsMap () {
    L.mapbox.accessToken = 'pk.eyJ1IjoiY3BlcnJpYXJkIiwiYSI6InN0UExhN28ifQ.GEm5rxAjECcgjIpy6pUY2g';
    var map = L.mapbox.map('artistsMap', 'cperriard.l7hpbn98', {maxZoom: 14})
        .setView([62.9, 15.6], 5);




    var cluster = new PruneClusterForLeaflet(80, 20);
    //cluster.Cluster.Size = 80;




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
            var content = "",
                bgColor = "#e70074";
            if (data[i].gender == 2){
                bgColor = "#00bbdb"
            } else if (data[i].gender == 3){
                bgColor = "grey"
            }


            var songs = JSON.parse(data[i].songs),
                songsCount,
                remark;
            if (songs.length) {
                songsCount = songs.length;
            } else {
                songsCount = 1;
                songs = [songs];
            }
            content += "<div class='map-header' style='background-color: " + bgColor + "'>" +
            "<h4>" + data[i].artist + "</h4>";
            var breakAge = "";
            if (data[i].age){
                content += "" + data[i].age + " år";
                breakAge = "<br>";
            }

            if (data[i].birthplace.length > 1){
                 content += breakAge + "Kommer från " + data[i].birthplace;
            }
            if (data[i].residence.length > 1){
                content += breakAge + "Bor i " + data[i].residence;
            }
            content += "</div>" +
            "<div class='map-body'><ul>";
            for (var j = 0; j < songsCount; j++){
                remark = songs[j].prel_remark;
                if (songs[j].final_placing == 1){
                    remark = "Vinnare!";
                } else if (songs[j].final_placing > 0){
                    remark = "" + songs[j].final_placing + ":a i finalen";
                }
                content += "<li>" + songs[j].year + ": " +
                "" + songs[j].song_name + " (" + remark + ") </li>";
            }
            content += "</ul></div>";
            marker.data.popup = content;

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
            if ($(this).hasClass("artistsToggleActiveCerise")){
                return;
            }
            $(this).toggleClass("artistsToggleActiveCerise");
            $("#artists_birth").toggleClass("artistsToggleActiveCerise");
            var exitInterval = true;
            clearInterval(timerId);
            timerId = window.setInterval(function () {
                var markers = cluster.Cluster._markers;
                for (var i = 0; i < markers.length; i++ ){
                    if ( Math.abs(markers[i].data.delta_lat) > 0 ) {

                        if ((markers[i].position.lat < markers[i].data.res_lat &&  Math.sign(markers[i].data.delta_lat) == 1) ||
                            (markers[i].position.lat > markers[i].data.res_lat &&  Math.sign(markers[i].data.delta_lat) == -1)){
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
            if ($(this).hasClass("artistsToggleActiveCerise")){
                return;
            }
            $(this).toggleClass("artistsToggleActiveCerise");
            $("#artists_residence").toggleClass("artistsToggleActiveCerise");
            var exitInterval = true;
            clearInterval(timerId);

            timerId = window.setInterval(function () {
                var markers = cluster.Cluster._markers;
                for (var i = 0; i < markers.length; i++ ){
                    if ( Math.abs(markers[i].data.delta_lat) > 0 ) {

                        if ((markers[i].position.lat < markers[i].data.birth_lat &&  Math.sign(markers[i].data.delta_lat) == -1) ||
                            (markers[i].position.lat > markers[i].data.birth_lat &&  Math.sign(markers[i].data.delta_lat) == 1) ){
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
            if( $this.hasClass("artistsToggleActiveBlue")) {
                showMen = false;
            } else {
                showMen = true;
            }
            $this.toggleClass("artistsToggleActiveBlue");
            var markers = cluster.Cluster._markers,
                bounds = $("#range-age").val().split(","),
                age;
            for (var i = 0; i < markers.length; i++ ){
                age = markers[i].data.age;
                if ( markers[i].category == 2 && age >= bounds[0] && age <= bounds[1] ) {
                    markers[i].filtered = !showMen;
                } else if (markers[i].category == 2) {
                    markers[i].filtered = !showMen;
                }
            }
            cluster.ProcessView();

        });

        $("#artists_female").on("click", function(e){
            var $this = $(this);
            if( $this.hasClass("artistsToggleActiveCerise")) {
                showFemale = false;
            } else {
                showFemale = true;
            }
            $this.toggleClass("artistsToggleActiveCerise");
            var markers = cluster.Cluster._markers,
                bounds = $("#range-age").val().split(","),
                age;
            for (var i = 0; i < markers.length; i++ ){
                age = markers[i].data.age;
                if ( markers[i].category == 1 && age >= bounds[0] && age <= bounds[1] ) {
                    markers[i].filtered = !showFemale;
                } else if (markers[i].category == 1) {
                    markers[i].filtered = !showFemale;
                }
            }
            cluster.ProcessView();

        });

        $("#artists_bands").on("click", function(e){
            var $this = $(this);
            if( $this.hasClass("artistsToggleActiveGrey")) {
                showBands = false;
            } else {
                showBands = true;
            }
            $this.toggleClass("artistsToggleActiveGrey");
            var markers = cluster.Cluster._markers,
                bounds = $("#range-age").val().split(","),
                age;
            for (var i = 0; i < markers.length; i++ ){
                age = markers[i].data.age;
                if ( markers[i].category == 3 && age >= bounds[0] && age <= bounds[1] ) {
                    markers[i].filtered = !showBands;
                } else if (markers[i].category == 3) {
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
                if ( age >= bounds[0] && age <= bounds[1] || typeof age === "undefined") {
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


function buildPlaceColChart(data) {
    var residenceData = [];
    var birthData = [];
    var categories = [];

    for (var i=0; i<data.length; ++i) {
        residenceData.push({
            name: data[i].place,
            y: data[i].residence
        });
        birthData.push({
            name: data[i].place,
            y: data[i].birthplace
        });
        categories.push(data[i].place)
    }
    //console.log(winnerData);

    var barChart = new Highcharts.Chart(
        {
            exporting: {
                enabled: false
            },
            chart: {
                renderTo: 'artists-place',
                type: 'column',
                height: 250
            },
            title: {
                text: 'Ort'
            },
            subtitle: {
                text: "Melloartister flyttar till storstäderna"
            },
            legend: {
                enabled: false
            },
            xAxis: {
                categories: categories,
                title: {
                    text: null
                },
                gridLineWidth: 0.0,
                labels: {
                    enabled: true
                },
                tickLength: 0,
                tickWidth: 0,
                lineWidth: 0
            },
            yAxis: [
                { // residence
                    title: {
                        text: null
                    },
                    labels: {
                        //    overflow: 'justify',
                        enabled: false
                    },
                    gridLineWidth: 0.0,
                    tickLength: 5,
                    tickWidth: 0,
                    tickColor: '#000000',
                    tickInterval: 250,

                    endOnTick: false,
                    isDirty: true
                },
                { // birth
                    title: {
                        text: null
                    },
                    min: 0,
                    max: 9,
                    opposite: true,
                    enabled: false,
                    labels: {
                        enabled: false,
                    },
                    gridLineWidth: 0.0,
                    tickLength: 5,
                    tickWidth: 0,
                    tickColor: '#000000',
                    tickInterval: 250,

                    endOnTick: false,
                    isDirty: true
                }],

            plotOptions: {
                column: {
                    //groupPadding: 0,
                    pointPadding: 0
                    //dataLabels: {
                    //
                    //    enabled: true,
                    //    formatter: function() {
                    //        return this.point.name;
                    //    }
                    //},
                    //borderWidth: 7
                }
            },

            tooltip: {
                formatter: function() {
                    //return '<small><b>' + this.x + '</b><br/>Andel förlorare: ' + (this.y * 100).toPrecision(2) + '%</small>';
                    //return 'Låtar på <b>' + this.x + '</b><br/>Andel ' + this.series.name + ': ' + (this.y*100).toPrecision(2) + '%</small>';
                    var where = 'bor i en storstadsregion';
                    if (this.y < 0.6) {
                        where = 'är födda i en storstadsregion';
                    }
                    if ((this.series.name == "Landsbygden" && this.series.options.id == "birth" && this.y > 0.5) ||
                        (this.series.name == "Storstadsregion" && this.series.options.id == "residence" && this.y < 0.5)){
                        where = 'bor på landsbygden';
                        if (this.y > 0.3) {
                            where = 'är födda på landsbygden';
                        }
                    }
                    return '<strong>' + (this.y*100).toPrecision(2) + '%</strong> av alla Melloartister ' + where + '.';
                }
                //pointFormat: '<b>{point.y}</b>'
            },

            credits: {
                enabled: false
            },
            series: [
                {
                    color: '#e70074',
                    data: residenceData,
                    id: "residence",
                    grouping: false,
                    name: "Storstadsregion",
                    index: 2,
                    legendIndex: 1,
                    yAxis: 0
                },
                {
                    grouping: false,
                    color: "grey",
                    data: birthData,
                    id: "birth",
                    pointPlacement: 0.2,
                    name : "Landsbygden",
                    index: 1,
                    legendIndex: 2,
                    yAxis: 0
                }
            ]
        }
    );
}

function week4(){

    $.ajax({
        type: "POST",
        url: "./data/artists_place.json",
        dataType: "json",
        success: function(response) {
            buildPlaceColChart(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus   );
        }
    });

    artistsMap();
}
