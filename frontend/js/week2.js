function buildTempoColChart(data) {
    var winnerData = [];
    var loserData = [];
    var categories = [];

    // Data munge
    // Histogram
    for (var i=0; i<data.tempos.length; ++i) {
        winnerData.push({
            name: data.tempos[i].tempo,
            y: data.tempos[i].winners
        });
        loserData.push({
            name: data.tempos[i].tempo,
            y: data.tempos[i].losers
        });
        categories.push(data.tempos[i].tempo)
    }

    // Construct charts
    var winnerBarChart = new Highcharts.Chart(
        {
            exporting: {
                enabled: false
            },
            chart: {
                renderTo: 'songsWinnersTempo',
                height: 250,
                backgroundColor: 'rgba(255,255,255,0)'
            },
            title: {
                //text: 'Vinnare sjunger i 128 BPM...'
                text: ''
            },
            subtitle: {
                text: '70% av alla vinnarlåtar går i runt 120-130 BPM <br/>(ca två taktslag i sekunden)...'
            },
            legend: {
                enabled: false
            },
            xAxis: {
                    min: 0,
                    max: 23,
                    categories: categories,
                    title: {
                        text: null
                    },
                    gridLineWidth: 0.0,
                    labels: {
                        formatter: function() {
                            return this.value % 20 == 0 ? this.value : "";
                        },
                        enabled: true,
                        step: 1
                    },
                    tickLength: 0,
                    tickWidth: 0,
                    lineWidth: 0
                },
            yAxis: {
                    min: 0,
                    max: 0.35,
                    title: {
                        text: null
                    },
                    labels: {
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
            plotOptions: {
                column: {
                    pointPadding: 0,
                    fillOpacity: 0.9,
                    point: {
                        events: {
                            mouseOver: function(){
                                    pHPlay(this);
                            },
                            mouseOut: function(){
                                pHStop();
                            },
                            click: function(){
                                pHPlay(this);
                            }
                        }
                    }
                },
                areaspline: {
                    fillOpacity: 0.4,
                    marker: {
                        enabled: false
                    }
                }
            },
            tooltip: {
                formatter: function() {
                    return '<small><b>' + this.x + ' BPM </b><br/>Andel vinnare: ' + (this.y * 100).toPrecision(2) + '%</small>';
                }
                //pointFormat: 'Antal vinnarlåtar: <b>{point.y}</b>'
            },
            credits: {
                enabled: false
            },
            series: [
                {
                    color: '#6e328f',
                    data: winnerData,
                    type: "column",
                    grouping: false,
                    name: "Vinnare"
                }]
        }
    );
    var loserBarChart = new Highcharts.Chart(
        {
            exporting: {
                enabled: false
            },
            chart: {
                renderTo: 'songsLosersTempo',
                type: 'column',
                height: 250
            },
            title: {
                //text: '...men förlorare sjunger i olika takt'
                text: ''
            },
            subtitle: {
                text: "...men förlorarlåtarna spelar i alla möjliga tempon."
            },
            legend: {
                enabled: false
            },
            xAxis: {
                min: 0,
                max: 23,
                categories: categories,
                title: {
                    text: null
                },
                gridLineWidth: 0.0,
                labels: {
                    formatter: function() {
                        return this.value % 20 == 0 ? this.value : null;
                    },
                    enabled: true,
                    step: 1
                },
                tickLength: 0,
                tickWidth: 0,
                lineWidth: 0
            },
            yAxis: {
                min: 0,
                max: 0.35,
                title: {
                    text: null
                },
                labels: {
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
            plotOptions: {
                column: {
                    pointPadding: 0,
                    fillOpacity: 0.9,
                    point: {
                        events: {
                            mouseOver: function(){
                                pHPlay(this);
                            },
                            mouseOut: function(){
                                pHStop();
                            },
                            click: function(){
                                pHPlay(this);
                            }
                        }
                    }
                },
                areaspline: {
                    fillOpacity: 0.4,
                    marker: {
                        enabled: false
                    }
                }
            },
            tooltip: {
                formatter: function() {
                    return '<small><b>' + this.x + ' BPM </b><br/>Andel förlorare: ' + (this.y * 100).toPrecision(2) + '%</small>';
                }
                //pointFormat: '<b>{point.y}</b>'
            },
            credits: {
                enabled: false
            },
            series: [{
                grouping: false,
                color: "grey",
                data: loserData,
                pointPlacement: 0.3,
                name : "Förlorare"
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
        });
        loserData.push({
            name: data[i].sentiment,
            y: data[i].losers
        });
        categories.push(data[i].sentiment)
    }
    //console.log(categories);

    var winnerBarChart = new Highcharts.Chart(
        {
            exporting: {
                enabled: false
            },
            chart: {
                renderTo: 'songsWinnersSentiment',
                height: 250
            },
            title: {
                //text: 'Vinnare använder mer känslor...'
                text: ''
            },
            subtitle: {
                text: "Mer än 50% av vinnarna sjunger om starka känslor<br/>(minst 20 känslopoäng plus eller minus)..."
            },
            legend: {
                enabled: false
            },
            xAxis: {
                min: 0,
                //max: 0.26,
                categories: categories,
                title: {
                    text: null
                },
                //type: "category",
                crossing:0,
                gridLineWidth: 0.0,
                labels: {
                    formatter: function() {
                        return this.value % 20 == 0 ? this.value : "";
                    },
                    enabled: true,
                    step: 1
                },
                tickLength: 0,
                tickWidth: 0,
                lineWidth: 0
            },
            yAxis: {
                min: 0,
                max: 0.26,
                title: {
                    text: null
                },
                labels: {
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
            plotOptions: {
                column: {
                    pointPadding: 0,
                    fillOpacity: 0.9
                },
                areaspline: {
                    fillOpacity: 0.4,
                    marker: {
                        enabled: false
                    }
                }
            },
            tooltip: {
                formatter: function() {
                    return '<small><b>' + this.x + ' känslopoäng </b><br/>Andel vinnare: ' + (this.y * 100).toPrecision(2) + '%</small>';
                }
                //pointFormat: '<b>{point.y}</b>'
            },
            credits: {
                enabled: false
            },
            series: [
                {
                    color: '#6e328f',
                    data: winnerData,
                    type: "column",
                    grouping: false,
                    name: "Vinnare"
                }]
        }
    );
    var loserBarChart = new Highcharts.Chart(
        {
            exporting: {
                enabled: false
            },
            chart: {
                renderTo: 'songsLosersSentiment',
                type: 'column',
                height: 250
            },
            title: {
                //text: '...och förlorare är mindre känslosamma'
                text: ''
            },
            subtitle: {
                text: "...men 60% av förlorarna ligger inom 10 känslopoäng från noll"
            },
            legend: {
                enabled: false
            },
            xAxis: {
                //min: 0,
                //max: 23,
                categories: categories,
                title: {
                    text: null
                },
                gridLineWidth: 0.0,
                labels: {
                    formatter: function() {
                        return this.value % 20 == 0 ? this.value : "";
                    },
                    enabled: true,
                    step: 1
                },
                tickLength: 0,
                tickWidth: 0,
                lineWidth: 0
            },
            yAxis: {
                min: 0,
                max: 0.26,
                title: {
                    text: null
                },
                labels: {
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
            plotOptions: {
                column: {
                    pointPadding: 0,
                    fillOpacity: 0.9
                },
                areaspline: {
                    fillOpacity: 0.4,
                    marker: {
                        enabled: false
                    }
                }
            },
            tooltip: {
                formatter: function() {
                    return '<small><b>' + this.x + ' känslopoäng </b><br/>Andel förlorare: ' + (this.y * 100).toPrecision(2) + '%</small>';
                }
                //pointFormat: '<b>{point.y}</b>'
            },
            credits: {
                enabled: false
            },
            series: [{
                grouping: false,
                color: "grey",
                data: loserData,
                pointPlacement: 0.3,
                name : "Förlorare"
            }]
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
                text: 'Språk'
            },
            subtitle: {
                text: "Vinnare sjunger på engelska, förlorare blandar och ger"
            },
            legend: {
                enabled: false
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
                    enabled: true
                },
                tickLength: 0,
                tickWidth: 0,
                lineWidth: 0
            },
            yAxis: //[
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

                    endOnTick: false,
                    isDirty: true
                }, /*,
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

                    endOnTick: false,
                    isDirty: true
                }*///],


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
                    return '<b>' + (this.y*100).toPrecision(2) + '%</b> av alla ' + this.series.name.toLowerCase() + '<br> sjunger på ' + this.x.toLowerCase();
                }
                //pointFormat: '<b>{point.y}</b>'
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
                text: 'Skrikighet'
            },
            subtitle: {
                text: "Vinnarlåtarna är 20% mer högljudda"
            },
            legend: {
                enabled: false
            },
            xAxis: {
                categories: data.categories,
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
            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    enabled: false
                },
                gridLineWidth: 0.0,
                tickLength: 5,
                tickWidth: 0,
                tickColor: '#000000',
                tickInterval: 250,

                endOnTick: false
            },
            plotOptions: {
                column: {
                    pointPadding: 0
                }
            },
            tooltip: {
                formatter: function() {
                    //return 'Genomsnittligt <em>noise</em> för<br/><b>' + this.x + '</b>: ' + this.y + ' dB';
                    return this.x + ' har i snitt ett <br/><em>noise</em> på <b>' + (this.y-10).toPrecision(2) + 'dB</b>';
                }
                //pointFormat: '<b>{point.y}</b>'
            },

            credits: {
                enabled: false
            },
            series: [
                {
                    color: 'grey',
                    data: [0, 10 + data.loudness_mean[1]],
                    grouping: false,
                    name: ""
                },
                {
                    color: '#6e328f',
                    data: [10 + data.loudness_mean[0], 0],
                    grouping: false,
                    name: ""
                }]
        }
    );
    var barChart = new Highcharts.Chart(
        {
            exporting: {
                enabled: false
            },
            chart: {
                renderTo: 'songsUniqueWords',
                type: 'column',
                height: 250
            },
            title: {
                text: 'Intellekt'
            },
            subtitle: {
                text: "Vinnare har 13% större ordförråd än förlorare"
            },
            legend: {
                enabled: false
            },
            xAxis: {
                categories: data.categories,
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
            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    enabled: false
                },
                gridLineWidth: 0.0,
                tickLength: 5,
                tickWidth: 0,
                tickColor: '#000000',
                tickInterval: 250,

                endOnTick: false
            },
            plotOptions: {
                column: {
                    pointPadding: 0
                }
            },
            tooltip: {
                formatter: function() {
                    return this.x + ' använder i <br/>snitt <b>' + this.y.toPrecision(3) + '</b> unika ord per låt';
                }
                //pointFormat: '<b>{point.y}</b>'
            },

            credits: {
                enabled: false
            },
            series: [
                {
                    color: 'grey',
                    data: [0, data.unique_mean[1]],
                    grouping: false,
                    name: ""
                },
                {
                    color: '#6e328f',
                    data: [data.unique_mean[0], 0],
                    grouping: false,
                    name: ""
                }]
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
        url: "./data/songs_wordsloudness.json",
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
            series1.setVisible(true, true);
        }
        if (!series2.visible) {
            series2.setVisible(true, true);
        }
        chart.reflow();
    }
});

$('#songShowWinners').click(function () {
    var chartNames = ["Tempo", "Sentiment", "Language", "Words"];

    for (var i in chartNames) {
        var chart = $('#songs' + chartNames[i]).highcharts(),
            series1 = chart.series[1],
            series2 = chart.series[0];

        if (!series1.visible) {
            series1.setVisible(true, true);
        }
        if (series2.visible) {
            series2.setVisible(false);
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
            series1.setVisible(false);
        }
        if (!series2.visible) {
            series2.setVisible(true, true);
        }
    }
});


// polyhymnia
window.pHContext = loadPolyhymnia();

window.pHNotes = [];

function loadPolyhymnia() {
    var context = new Polyhymnia.Context({
        instruments: [
            { name: 'Kick', samples: [{ url: 'audio/Kick.mp3' }] }
        ]
    });

    context.parse( 'Play -> Kick:   _ _ x _ _ _ x _ _ _ x _ _ _ x _' );

    return context;
}

window.start = 0;

function pHAnimCallback(notes){
    if ( notes[ 0 ].value === "x" && window.start !==  notes[ 0 ].start){
        //console.log(notes[ 0 ].start);
        window.start = notes[ 0 ].start;
        window.pHChartElement.graphic.animate({opacity: 0.1}, {duration: 0});
        window.pHChartElement.graphic.animate({opacity: 1}, {duration: 60/window.pHChartElement.name});
    }
    pHNotes.push(notes);

    if(pHNotes.length === Math.pow(2, 7)) {
        pHStop();
    }
}

function pHPlay( element ) {
    if ( pHNotes.length === 0 ) {
        pHStop();
        window.pHChartElement = element;
        pHContext.setTempo( element.name );
        pHContext.setAnimCallback(pHAnimCallback);
        pHContext.play();
    }
}

function pHStop(){
    pHContext.stop();
    window.pHNotes = [];
}
