function artistsMap () {

    function sign(x) {
        return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
    }

    $("#artistsMap").css("height", "" + window.innerHeight * 0.85 + "px")
    L.mapbox.accessToken = 'pk.eyJ1IjoiY3BlcnJpYXJkIiwiYSI6InN0UExhN28ifQ.GEm5rxAjECcgjIpy6pUY2g';
    var map = L.mapbox.map('artistsMap', 'cperriard.l7hpbn98', {maxZoom: 12, minZoom: 3})
        .setView([62.9, 15.6], 5);

    L.control.fullscreen().addTo(map);
    //map.addControl(L.mapbox.geocoderControl('mapbox.places'));

    var markerGroup = L.mapbox.featureLayer().addTo(map);




    var oms = new OverlappingMarkerSpiderfier(map, { keepSpiderfied: true, nearbyDistance: 15 });
    var popup = new L.Popup();
    oms.addListener('spiderfy', function(markers) {

        map.closePopup();
        markerGroup.eachLayer(function(marker) {
                marker.setOpacity(0.2);
        });
        for (var i = 0; i < markers.length; i++){
            markers[i].setOpacity(1);
        }
    });
    oms.addListener('unspiderfy', function(markers) {
        for (var i = 0; i < markers.length; i++){
            if (markers[i].data.winner){
                markers[i].setZIndexOffset(1000);
            }
            markers[i].setOpacity(1);
        }
        markerGroup.eachLayer(function(marker) {
            marker.setOpacity(1);
        });
    });





    $.getJSON('data/artists.json', function(data){
        var marker, lat, lon;


        for ( var i = 0; i < data.length; i++ ) {
            var markerColor = "#808080",
                winner = false,
                zIndexOffset = 0;

            if (data[i].birth_lat) {
                lat = data[i].birth_lat;
                lon = data[i].birth_lon;
                if (data[i].nearest_birth_distance == 0) {
                }
            } else {
                lat = data[i].res_lat;
                lon = data[i].res_lon;
                if (data[i].nearest_res_distance == 0) {
                }
            }

            /* marker color */
            if (data[i].gender == 1){
                markerColor = "#e70074";
            } else if (data[i].gender == 2){
                markerColor = "#00bbdb";
            }

            /* start popup */
            var songs = JSON.parse(data[i].songs),
                popupContent = "",
                songsContent = "",
                songsCount,
                remark;

            if (songs.length) {
                songsCount = songs.length;
            } else {
                songsCount = 1;
                songs = [songs];
            }

            for (var j = 0; j < songsCount; j++){
                remark = songs[j].prel_remark;
                if (songs[j].final_placing == 1){
                    remark = "Vinnare!";
                    markerColor = "#ffd700"; // gold marker for winners
                    winner = true;
                    zIndexOffset = 1000;
                } else if (songs[j].final_placing > 0){
                    remark = "" + songs[j].final_placing + ":a i finalen";
                }
                songsContent += "<li>" + songs[j].year + ": " +
                "" + songs[j].song_name + " (" + remark + ") </li>";
            }


            popupContent += "<div class='map-header' style='background-color: " + markerColor + "'>" +
            "<h4>" + data[i].artist + "</h4>";
            var breakAge = "";
            if (data[i].age){
                popupContent += "" + data[i].age + " år";
                breakAge = "<br>";
            }

            if (data[i].birthplace.length > 1){
                popupContent += breakAge + "Kommer från " + data[i].birthplace;
                if (breakAge == ""){
                    breakAge = "<br>";
                }
            }
            if (data[i].residence.length > 1){
                popupContent += breakAge + "Bor i " + data[i].residence;
            }
            popupContent += "</div>" +
            "<div class='map-body'>" +
            "<ul>" + songsContent +  "</ul>" +
            "</div>";

            /* end popuup */










            marker = L.marker( [lat, lon], {
                icon: L.mapbox.marker.icon({
                    'marker-color': markerColor,
                    'marker-size': 'small'
                }),
                zIndexOffset: zIndexOffset
            } );

            marker.bindPopup(popupContent);
            //marker.popupContent = popupContent;

            marker.category = data[i].gender;

            marker.data = {};

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

            marker.data.winner = winner;


            markerGroup.addLayer(marker);
            oms.addMarker(marker);
        }



        var timerId,
            step = 0.004;
        if ( window.innerWidth >= 768 ){
            step = 0.02;
        }

        var men = [],
            female = [],
            bands = [];

        $("#artists_residence").on("click", function(e){
            oms.unspiderfy();
            e.preventDefault();
            e.stopPropagation();
            if ($(this).hasClass("artistsToggleActiveCerise")){
                return;
            }
            $(this).toggleClass("artistsToggleActiveCerise");
            $(this).toggleClass("artistsToggleInActiveCerise");
            $("#artists_birth").toggleClass("artistsToggleActiveCerise");
            $("#artists_birth").toggleClass("artistsToggleInActiveCerise");
            var exitInterval = true;
            clearInterval(timerId);
            timerId = window.setInterval(function () {

                markerGroup.eachLayer(function(marker) {

                    if ( Math.abs(marker.data.delta_lat) > 0 ) {
                        var latLng = marker.getLatLng();
                        var lat = latLng.lat,
                            lng = latLng.lng;

                        if ((lat < marker.data.res_lat &&  sign(marker.data.delta_lat) == 1) ||
                            (lat > marker.data.res_lat &&  sign(marker.data.delta_lat) == -1)){


                            lat += step * marker.data.delta_lat;
                            lng += step * marker.data.delta_lon;

                            marker.setLatLng(L.latLng(lat, lng));
                            exitInterval = false;
                        } else {
                            marker.setLatLng( L.latLng(marker.data.res_lat, marker.data.res_lon) );
                        }
                    }
                });


                if (exitInterval) {
                    if (men.length > 0){
                        for(var i = 0; i < men.length; i++){
                            if (Math.abs(men[i].data.delta_lat) > 0 ) {
                                men[i].setLatLng( L.latLng(men[i].data.res_lat, men[i].data.res_lon) );
                            }
                        }
                    }
                    if (female.length > 0){
                        for(var i = 0; i < female.length; i++){
                            if (Math.abs(female[i].data.delta_lat) > 0 ) {
                                female[i].setLatLng( L.latLng(female[i].data.res_lat, female[i].data.res_lon) );
                            }
                        }
                    }
                    if (bands.length > 0){
                        for(var i = 0; i < bands.length; i++){
                            if (Math.abs(bands[i].data.delta_lat) > 0 ) {
                                bands[i].setLatLng( L.latLng(bands[i].data.res_lat, bands[i].data.res_lon) );
                            }
                        }
                    }
                    clearInterval(timerId);
                }
                exitInterval = true;
            }, 1);
        });

        $("#artists_birth").on("click", function(e){
            oms.unspiderfy();
            e.preventDefault();
            e.stopPropagation();
            if ($(this).hasClass("artistsToggleActiveCerise")){
                return;
            }
            $(this).toggleClass("artistsToggleActiveCerise");
            $("#artists_residence").toggleClass("artistsToggleActiveCerise");
            $(this).toggleClass("artistsToggleInActiveCerise");
            $("#artists_residence").toggleClass("artistsToggleInActiveCerise");
            var exitInterval = true;
            clearInterval(timerId);

            timerId = window.setInterval(function () {

                markerGroup.eachLayer(function(marker) {

                    if ( Math.abs(marker.data.delta_lat) > 0 ) {
                        var latLng = marker.getLatLng();
                        var lat = latLng.lat,
                            lng = latLng.lng;

                        if ((lat < marker.data.birth_lat &&  sign(marker.data.delta_lat) == -1) ||
                            (lat > marker.data.birth_lat &&  sign(marker.data.delta_lat) == 1)){


                            lat -= step * marker.data.delta_lat;
                            lng -= step * marker.data.delta_lon;

                            marker.setLatLng(L.latLng(lat, lng));
                            exitInterval = false;
                        } else {
                            marker.setLatLng( L.latLng(marker.data.birth_lat, marker.data.birth_lon) );
                        }
                    }
                });

                if (exitInterval) {
                    if (men.length > 0){
                        for(var i = 0; i < men.length; i++){
                            if (Math.abs(men[i].data.delta_lat) > 0 ) {
                                men[i].setLatLng( L.latLng(men[i].data.res_lat, men[i].data.res_lon) );
                            }
                        }
                    }
                    if (female.length > 0){
                        for(var i = 0; i < female.length; i++){
                            if (Math.abs(female[i].data.delta_lat) > 0 ) {
                                female[i].setLatLng( L.latLng(female[i].data.res_lat, female[i].data.res_lon) );
                            }
                        }
                    }
                    if (bands.length > 0){
                        for(var i = 0; i < bands.length; i++){
                            if (Math.abs(bands[i].data.delta_lat) > 0 ) {
                                bands[i].setLatLng( L.latLng(bands[i].data.res_lat, bands[i].data.res_lon) );
                            }
                        }
                    }
                    clearInterval(timerId);
                }
                exitInterval = true;
            }, 1);
        });




        $("#artists_men").on("click", function(e){
            var $this = $(this);
            if( $this.hasClass("artistsToggleActiveBlue")) {
                markerGroup.eachLayer(function(marker) {
                    if (marker.category == 2) {
                        markerGroup.removeLayer(marker);
                        men.push(marker);
                    }
                });
            } else {
                for(var i = 0; i < men.length; i++){
                    markerGroup.addLayer(men[i]);
                }
                men = [];
            }
            $this.toggleClass("artistsToggleActiveBlue");
            $this.toggleClass("artistsToggleInActiveBlue");
        });

        $("#artists_female").on("click", function(e){
            var $this = $(this);
            if( $this.hasClass("artistsToggleActiveCerise")) {
                markerGroup.eachLayer(function(marker) {
                    if (marker.category == 1) {
                        markerGroup.removeLayer(marker);
                        female.push(marker);
                    }
                });
            } else {
                for(var i = 0; i < female.length; i++){
                    markerGroup.addLayer(female[i]);
                }
                female = [];
            }
            $this.toggleClass("artistsToggleActiveCerise");
            $this.toggleClass("artistsToggleInActiveCerise");
        });

        $("#artists_bands").on("click", function(e){
            var $this = $(this);
            if( $this.hasClass("artistsToggleActiveGrey")) {
                markerGroup.eachLayer(function(marker) {
                    if (marker.category == 3) {
                        markerGroup.removeLayer(marker);
                        bands.push(marker);
                    }
                });
            } else {
                for(var i = 0; i < bands.length; i++){
                    markerGroup.addLayer(bands[i]);
                }
                bands = [];
            }
            $this.toggleClass("artistsToggleActiveGrey");
            $this.toggleClass("artistsToggleInActiveGrey");
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

   /* $.ajax({
        type: "POST",
        url: "./data/artists_place.json",
        dataType: "json",
        success: function(response) {
            buildPlaceColChart(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus   );
        }
    });*/

    artistsMap();
}
