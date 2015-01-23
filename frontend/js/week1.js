function buildLovePiechart(data) {

    var formattedData = [];
    var colPat = {
        pattern: 'images/pattern-blue.png',
        width: 5,
        height: 5
    };
    var colors = ['#00bbdb', colPat, '#FFFFFF'];

    for (var i=0; i<data.length; ++i) {
        formattedData.push({
            color: colors[i],
            name: data[i].name,
            y: data[i].freq
        });
    }

    var pieChart = new Highcharts.Chart({
        credits: {
            enabled: false
        },
        chart: {
            renderTo: 'lovePieChart',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: 'Vad sjunger de om?'
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                borderColor: '#00bbdb',
                borderWidth: 2,
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [
            {
                type: 'pie',
                data: formattedData,
                states: {
                    hover: {
                        enabled: true,
                        halo: {
                            attributes: {
                                'stroke-width': 0.5,
                                stroke: '#00bbdb'
                            },
                            size: 7
                        },
                        lineWidth: 3,
                        marker: {
                            lineColor: "#000000",
                            lineWidth: 3
                        }
                    }
                }
            }]
    });

    $(pieChart.series[0].data).each(function(i, slice){
        $(slice.legendSymbol.element).attr('stroke-width','2');
        $(slice.legendSymbol.element).attr('stroke',  '#00bbdb');

    });

}

function buildWordFrequencyChart(data) {
    var freqData = [];
    var catData = [];

    for (var i=0; i<data.length; ++i) {
        freqData.push({
            name: data[i].words,
            y: data[i].freqs
        });
        catData.push(data[i].words)
     }


    var barChart = new Highcharts.Chart(
        {
            chart: {
                renderTo: 'wordFreqChart',
                type: 'bar'
            },
            title: {
                text: 'Word frequencies'
            },
            legend: {
                enabled:false
            },
            xAxis: {
                categories: catData,
                title: {
                    text: null
                },
                gridLineWidth: 0.0,
                labels: {
                    formatter: function() {
                        return "";
                    }
                },
                tickLength: 0,
                tickWidth: 0,
                lineWidth: 0
            },
            yAxis: {
                min: 0,
                title: {
                  text: null
                },
                labels: {
                    overflow: 'justify'
                },
                gridLineWidth: 0.0,
                tickLength: 5,
                tickWidth: 2.0,
                tickColor: '#000000',
                tickInterval: 250,

                endOnTick: false
            },

            plotOptions: {
                bar: {
                    groupPadding: 0,
                    pointPadding: 0,
                    dataLabels: {

                        enabled: true,
                        formatter: function() {
                            return this.point.name;
                        }
                    }
                }
            },

            tooltip: {
                pointFormat: '<b>{point.y}</b>'
            },

            credits: {
                enabled: false
            },
            series: [{
                color: '#00bbdb',
                data: freqData
            }]
        }
    );

}

function week1() {
    $.ajax({
        type: "GET",
        url: "./data/texterna_loveprops.json",
        dataType: "json",
        success: function(response) {
            buildLovePiechart(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus   );
        }
    });

    $.ajax({
        type: "GET",
        url: "./data/texterna_wordfreqs.json",
        dataType: "json",
        success: function(response) {
            buildWordFrequencyChart(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus   );
        }
    });
}
