/* Vinnarna */
function buildWinnerBars(data) {
    var winnerChart = {
        exporting: {
            enabled: false
        },
        chart: {
            renderTo: 'weightBars',
            type: 'column',
            //height: 250
            backgroundColor: 'rgba(255,255,255,0)'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        legend: {
            enabled: false
        },
        xAxis: {
            //min: 0,
            //max: 23,
            //categories: categories,
            type: 'category',
            title: {
                text: null
            },
            gridLineWidth: 0.0,
            labels: {
                autoRotation: [-60]
            },
            //labels: {
            //    formatter: function() {
            //        var val = this.value,
            //            ret = val % 20 == 0 ? val : null;
            //
            //        return ret;
            //        return this.value;
            //    },
            //    enabled: true
            //},
            tickLength: 0,
            tickWidth: 0,
            lineWidth: 0
        },
        yAxis: {
        //    min: 0,
        //    max: 0.40,
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
                //pointPadding: 0,
                //fillOpacity: 0.9,
                stacking: 'normal',
                dataLabels: {
                    enabled: false
                }
            }
            //areaspline: {
            //    fillOpacity: 0.4,
            //    marker: {
            //        enabled: false
            //    }
            //}
        },
        //tooltip: {
        //    formatter: function() {
        //        return '<small><b>' + this.x + ' BPM </b><br/>Andel vinnare: ' + (this.y * 100).toPrecision(2) + '%</small>';
        //    }
        //},
        credits: {
            enabled: false
        },
        series: [{
            color: '#00c609',
            data: data,
            name: "Sannolikhet"
            //type: "column",
            //grouping: false
            //name: "Vinnare"
        }]
    }

    //var chart = new Highcharts.Chart(Highcharts.merge(winnerChart, Highcharts.theme));
    var chart = new Highcharts.Chart(winnerChart);
}

function buildWinnerSpider( data ){

    data.series[0].color = "#00c609";
    var chartWidth = $('#weightSpider').innerWidth(),
        fontSize = 16,
        distanceLabels = 20,
        paddingLabels = 5;

    if (chartWidth <= 600){
        fontSize = 14;
        distanceLabels = 2;
        paddingLabels = 0;
    }
    if (chartWidth <= 500){
        fontSize = 12;
    }
    if (chartWidth <= 400){
        fontSize = 10;
    }

    $('#weightSpider').highcharts({

        chart: {
            polar: true,
            type: "line",
            height: Math.min(chartWidth/3*2.5, 400)
        },
        credits: {
            enabled: false
        },

        title: {
            text: ''
        },



        xAxis: {
            categories: data.categories,
            tickmarkPlacement: 'on',
            lineWidth: 0,
            labels: {
                distance: distanceLabels,
                padding: paddingLabels,
                format: '<span style="font-size: ' + fontSize + 'px;">{value}</span>'
            }

        },

        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0
        },

        tooltip: {
            //shared: true,
            formatter: function(){
                var index = this.point.index;
                var headerLabel = data.tooltip[index];
                var output = '<span tyle="font-size: 16px;">' + headerLabel + '</span><br>' +
                    '<span style="font-size: 14px;">' + this.series.name + ': </span>' +
                    '<span style="font-size: 14px; font-weight: bold">' + this.y + '</span>';
                return output;

            }
            //headerFormat: '<span style="font-size: 16px;">{point.key}</span><br/>',
            //pointFormat: '<span style="font-size: 14px;">{series.name}: </span><span style="font-size: 14px; font-weight: bold">{point.y}</span>'
        },

        legend: {enabled: false},

        series: data.series

    });


}



function week6Collapse(){
       /*
    $.ajax({
        type: "GET",
        url: "./data/winners_spider_dummy.json",
        dataType: "json",
        success: function(response) {
            buildWinnerSpider(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Error! " + textStatus);
        }
    });*/

}

/* Init */
function week6() {

       /*
    $.ajax({
        type: "GET",
        url: "./data/winners_mock_weights.json",
        dataType: "json",
        success: function(response) {
            buildWinnerBars(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Error! " + textStatus);
        }
    });*/

    $.ajax({
        type: "GET",
        url: "./data/winners_spider.json",
        dataType: "json",
        success: function(response) {
            buildWinnerSpider(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Error! " + textStatus);
        }
    });

}