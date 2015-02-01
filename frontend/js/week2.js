function buildTempoColChart(data) {
    var songData = [];
    var categories = [];

    for (var i=0; i<data.length; ++i) {
        songData.push({
            name: data[i].tempo,
            y: data[i].freq,
        });
        categories.push(data[i].tempo)
    }


    var barChart = new Highcharts.Chart(
        {
            exporting: {
                enabled: false
            },
            chart: {
                renderTo: 'songsTempo',
                type: 'column',
                height: 250
            },
            title: {
                text: 'Vinnare sjunger i 128 BPM'
            },
            legend: {
                enabled:false
            },
            xAxis: {
                min: 5,
                max: 45,
                categories: categories,
                title: {
                    text: null
                },
                gridLineWidth: 0.0,
                labels: {
                    formatter: function() {
                        return this.value % 4 == 0 ? this.value : "";

                    }
                },
                //labels: {
                //    enabled: false
                //},
                tickLength: 0,
                tickWidth: 0,
                lineWidth: 0
            },
            yAxis: {
                min: 0,
                max: 15,
                title: {
                    text: null
                },
                //labels: {
                //    overflow: 'justify'
                //},
                labels: {
                    enabled: false
                },
                gridLineWidth: 0.0,
                tickLength: 5,
                tickWidth: 0,
                tickColor: '#000000',
                tickInterval: 250,

                endOnTick: false
                //max: 1000
            },

            plotOptions: {
                column: {
                    groupPadding: 0,
                    pointPadding: 0,
                    //dataLabels: {
                    //
                    //    enabled: true,
                    //    formatter: function() {
                    //        return this.point.name;
                    //    }
                    //},
                    borderWidth: 7
                }
            },

            tooltip: {
                pointFormat: '<b>{point.y}</b>'
            },

            credits: {
                enabled: false
            },
            series: [{
                color: '#6e328f',
                data: songData
            }]
        }
    );
}

function buildSentimentColChart(data) {
    var winnerData = [];
    var loserData = [];
    var categories = [];

    for (var i=0; i<data.length; ++i) {
        winnerData.push({
            name: data[i].sentiment,
            y: data[i].winners
            //y2: data[i].losers
        });
        loserData.push({
            name: data[i].sentiment,
            y: data[i].losers
        });
        categories.push(data[i].sentiment)
        //categories.push(data[i].sentiment + 5)
    }
    //console.log(songData);

    var barChart = new Highcharts.Chart(
        {
            exporting: {
                enabled: false
            },
            chart: {
                renderTo: 'songsSentiment',
                type: 'column',
                height: 250
            },
            title: {
                text: 'Vinnare sjunger gladare låtar'
            },
            legend: {
                enabled:false
            },
            xAxis: {
                min: 0,
                max: 30,
                categories: categories,
                title: {
                    text: null
                },
                gridLineWidth: 0.0,
                labels: {
                    formatter: function() {
                        return this.value % 4 == 0 ? this.value : "";

                    }
                },
                labels: {
                    enabled: false
                },
                tickLength: 0,
                tickWidth: 0,
                lineWidth: 0
            },
            yAxis: {
                min: 0,
                //max: 8,
                title: {
                    text: null
                },
                //labels: {
                //    overflow: 'justify'
                //},
                labels: {
                    enabled: false
                },
                gridLineWidth: 0.0,
                tickLength: 5,
                tickWidth: 0,
                tickColor: '#000000',
                tickInterval: 250,

                endOnTick: false
                //max: 1000
            },

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
                pointFormat: '<b>{point.y}</b>'
            },

            credits: {
                enabled: false
            },
            series: [
                {
                    grouping: false,
                    color: "grey",
                    data: loserData,
                    shadow: false
                    //pointPadding: 0,
                    //zIndex: 5
                },
                {
                    color: '#6e328f',
                    data: winnerData,
                    grouping: false,
                    shadow: false
                }
            ]
        }
    );
}

function week2() {
    $.ajax({
        type: "POST",
        url: "./data/songs_tempo.json",
        dataType: "json",
        success: function(response) {
            buildTempoColChart(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus   );
        }
    });

    $.ajax({
        type: "POST",
        url: "./data/songs_sentiment.json",
        dataType: "json",
        success: function(response) {
            buildSentimentColChart(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus   );
        }
    });
}

$(function () {
    var firstPostLoaded = false;
    $('#lasVidareID').on('click', function(e) {
        e.preventDefault();
        var $this = $(this);
        var $collapse = $this.closest('.collapse-group').find('.collapse');
        $collapse.collapse('toggle');
        var postNr = $this.closest('.collapse-group').attr("data-post")
        if ( !firstPostLoaded &postNr == 1 ){
            //week2Collapse();
            firstPostLoaded = true;
        }
    });

    week2();
});