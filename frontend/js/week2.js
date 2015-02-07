function buildTempoColChart(data) {
    var winnerData = [];
    var loserData = [];
    var categories = [];

    for (var i=0; i<data.length; ++i) {
        winnerData.push({
            name: data[i].tempo,
            y: data[i].winners
        });
        loserData.push({
            name: data[i].tempo,
            y: data[i].losers
        });
        categories.push(data[i].tempo)
    }
    //console.log(winnerData);

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
                enabled: true
            },
            xAxis: {
                min: 10,
                max: 50,
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
            yAxis: [
                { // Vinnare
                    min: 0,
                    max: 11,
                    title: {
                        text: null
                    },
                    labels: {
                        //    overflow: 'justify',
                        enabled: false,
                    },
                    gridLineWidth: 0.0,
                    tickLength: 5,
                    tickWidth: 0,
                    tickColor: '#000000',
                    tickInterval: 250,

                    endOnTick: false
                },
                { // Förlorare
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

                    endOnTick: false
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
                pointFormat: '<b>{point.y}</b>'
            },

            credits: {
                enabled: false
            },
            series: [
                {
                    color: '#6e328f',
                    data: winnerData,
                    grouping: false,
                    name: "Vinnare",
                    index: 2,
                    legendIndex: 1,
                    yAxis: 0
                },
                {
                    grouping: false,
                    color: "grey",
                    data: loserData,
                    pointPlacement: 0.3,
                    name : "Förlorare",
                    index: 1,
                    legendIndex: 2,
                    yAxis: 1
                }
            ]
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
        });
        loserData.push({
            name: data[i].sentiment,
            y: data[i].losers
        });
        categories.push(data[i].sentiment)
    }
    //console.log(winnerData);

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
                enabled: true
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
            yAxis: [
                { // Vinnare
                    min: 0,
                    max: 6,
                    title: {
                        text: null
                    },
                    labels: {
                        //    overflow: 'justify',
                        enabled: false,
                    },
                    gridLineWidth: 0.0,
                    tickLength: 5,
                    tickWidth: 0,
                    tickColor: '#000000',
                    tickInterval: 250,

                    endOnTick: false
                },
                { // Förlorare
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

                    endOnTick: false
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
                pointFormat: '<b>{point.y}</b>'
            },

            credits: {
                enabled: false
            },
            series: [
                {
                    color: '#6e328f',
                    data: winnerData,
                    grouping: false,
                    name: "Vinnare",
                    index: 2,
                    legendIndex: 1,
                    yAxis: 0
                },
                {
                    grouping: false,
                    color: "grey",
                    data: loserData,
                    pointPlacement: 0.3,
                    name : "Förlorare",
                    index: 1,
                    legendIndex: 2,
                    yAxis: 1
                }
            ]
        }
    );
}

function buildLanguageColChart(data) {
    var winnerData = [];
    var loserData = [];
    var categories = [];

    for (var i=0; i<data.length; ++i) {
        winnerData.push({
            name: data[i].language,
            y: data[i].winners
        });
        loserData.push({
            name: data[i].language,
            y: data[i].losers
        });
        categories.push(data[i].language)
    }
    //console.log(winnerData);

    var barChart = new Highcharts.Chart(
        {
            exporting: {
                enabled: false
            },
            chart: {
                renderTo: 'songsLanguage',
                type: 'column',
                height: 250
            },
            title: {
                text: 'Vinnare sjunger på engelska'
            },
            legend: {
                enabled: true
            },
            xAxis: {
                //min: 0,
                //max: 2,
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
            yAxis: [
                { // Vinnare
                    //min: 0,
                    //max: 6,
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

                    endOnTick: false
                },
                { // Förlorare
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

                    endOnTick: false
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
                pointFormat: '<b>{point.y}</b>'
            },

            credits: {
                enabled: false
            },
            series: [
                {
                    color: '#6e328f',
                    data: winnerData,
                    grouping: false,
                    name: "Vinnare",
                    index: 2,
                    legendIndex: 1,
                    yAxis: 0
                },
                {
                    grouping: false,
                    color: "grey",
                    data: loserData,
                    pointPlacement: 0.2,
                    name : "Förlorare",
                    index: 1,
                    legendIndex: 2,
                    yAxis: 0
                }
            ]
        }
    );
}

function buildWordColChart(data) {
    var winnerData = [];
    var loserData = [];
    var categories = [];

    for (var i=0; i<data.length; ++i) {
        winnerData.push({
            name: data[i].words,
            y: data[i].winners
        });
        loserData.push({
            name: data[i].words,
            y: data[i].losers
        });
        categories.push(data[i].words)
    }
    //console.log(winnerData);

    var barChart = new Highcharts.Chart(
        {
            exporting: {
                enabled: false
            },
            chart: {
                renderTo: 'songsWords',
                type: 'column',
                height: 250
            },
            title: {
                text: 'Vinnare använder fler ord'
            },
            legend: {
                enabled: true
            },
            xAxis: {
                //min: 0,
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
            yAxis: [
                { // Vinnare
                    min: 0,
                    //max: 11,
                    title: {
                        text: null
                    },
                    labels: {
                        //    overflow: 'justify',
                        enabled: false,
                    },
                    gridLineWidth: 0.0,
                    tickLength: 5,
                    tickWidth: 0,
                    tickColor: '#000000',
                    tickInterval: 250,

                    endOnTick: false
                },
                { // Förlorare
                    title: {
                        text: null
                    },
                    min: 0,
                    //max: 9,
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

                    endOnTick: false
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
                pointFormat: '<b>{point.y}</b>'
            },

            credits: {
                enabled: false
            },
            series: [
                {
                    color: '#6e328f',
                    data: winnerData,
                    grouping: false,
                    name: "Vinnare",
                    index: 2,
                    legendIndex: 1,
                    yAxis: 0
                },
                {
                    grouping: false,
                    color: "grey",
                    data: loserData,
                    pointPlacement: 0.3,
                    name : "Förlorare",
                    index: 1,
                    legendIndex: 2,
                    yAxis: 1
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

    $.ajax({
        type: "POST",
        url: "./data/songs_language.json",
        dataType: "json",
        success: function(response) {
            buildLanguageColChart(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus   );
        }
    });

    $.ajax({
        type: "POST",
        url: "./data/songs_words.json",
        dataType: "json",
        success: function(response) {
            buildWordColChart(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus   );
        }
    });
}

$('#songShowAll').click(function () {
    var chartNames = ["Tempo", "Sentiment", "Language", "Words"];

    for (var i in chartNames) {
        var chart = $('#songs' + chartNames[i]).highcharts(),
            series1 = chart.series[1],
            series2 = chart.series[0];

        if (!series1.visible) {
            series1.show();
        }
        if (!series2.visible) {
            series2.show();
        }
    }
});

$('#songShowWinners').click(function () {
    var chartNames = ["Tempo", "Sentiment", "Language", "Words"];

    for (var i in chartNames) {
        var chart = $('#songs' + chartNames[i]).highcharts(),
            series1 = chart.series[1],
            series2 = chart.series[0];

        if (!series1.visible) {
            series1.show();
        }
        if (series2.visible) {
            series2.hide();
        }
    }
});

$('#songShowLosers').click(function () {
    var chartNames = ["Tempo", "Sentiment", "Language", "Words"];

    for (var i in chartNames) {
        var chart = $('#songs' + chartNames[i]).highcharts(),
            series1 = chart.series[1],
            series2 = chart.series[0];

        if (series1.visible) {
            series1.hide();
        }
        if (!series2.visible) {
            series2.show();
        }
    }
});

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