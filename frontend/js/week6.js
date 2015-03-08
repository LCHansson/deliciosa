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

function buildWinnerSpider( data ){
    $('#weightSpider').highcharts({

        chart: {
            polar: true,
            type: 'line'
        },
        credits: {
            enabled: false
        },

        title: {
            text: 'Budget vs spending',
            x: -80
        },

        pane: {
            size: '80%'
        },

        xAxis: {
            categories: ['Sales', 'Marketing', 'Development', 'Customer Support',
                'Information Technology', 'Administration'],
            tickmarkPlacement: 'on',
            lineWidth: 0
        },

        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0
        },

        tooltip: {
            shared: true,
            pointFormat: '<span style="color:{series.color}">{series.name}: <b>${point.y:,.0f}</b><br/>'
        },

        legend: {
            align: 'right',
            verticalAlign: 'top',
            y: 70,
            layout: 'vertical'
        },

        series: [{
            name: 'Allocated Budget',
            data: [43000, 19000, 60000, 35000, 17000, 10000],
            pointPlacement: 'on'
        }, {
            name: 'Actual Spending',
            data: [50000, 39000, 42000, 31000, 26000, 14000],
            pointPlacement: 'on'
        }]

    });
}

function week6Collapse(){
    buildWinnerSpider();
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