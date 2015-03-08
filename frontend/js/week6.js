/* Vinnarna */
function buildWinnerBars(data) {
    var winnerChart = {
        exporting: {
            enabled: false
        },
        chart: {
            renderTo: 'weightBars'
            //height: 250
            //backgroundColor: 'rgba(255,255,255,0)'
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
            title: {
                text: null
            },
            gridLineWidth: 0.0,
            labels: {
                formatter: function() {
                    var val = this.value,
                        ret = val % 20 == 0 ? val : null;

                    return ret;
                    //return this.value;
                },
                enabled: true
            },
            tickLength: 0,
            tickWidth: 0,
            lineWidth: 0
        },
        yAxis: {
            //min: 0,
            //max: 0.40,
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
        //tooltip: {
        //    formatter: function() {
        //        return '<small><b>' + this.x + ' BPM </b><br/>Andel vinnare: ' + (this.y * 100).toPrecision(2) + '%</small>';
        //    }
        //},
        credits: {
            enabled: false
        },
        series: [
            {
                color: 'green',
                data: data,
                type: "column",
                grouping: false
                //name: "Vinnare"
            }]
    }

    var chart = new Highcharts.Chart(Highcharts.merge(winnerChart, Highcharts.theme));
}

/* Init */
function week6() {

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
    });

}