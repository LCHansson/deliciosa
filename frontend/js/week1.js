function buildLovePiechart(data) {
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
            text: 'Vas sjunger de om?'
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                borderColor: '#00bbdb',
                borderWidth: 4,
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
                data: [
                    {
                        y: data["Kärlek"][0],
                        color: '#00bbdb',
                        name: 'Kärlek'
                    },
                    {
                        y: data["Lite kärlek"][0],
                        color: {
                            pattern: 'images/pattern-blue.png',
                            width: 32,
                            height: 32
                        },
                        name: 'Lite kärlek'
                    },
                    {
                        y: data["Inte kärlek"][0],
                        color: '#FFFFFF',
                        name: 'Ingen kärlek',
                    }
                ],
                states: {
                    hover: {
                        enabled: false
                    }
                }
            }]
    });

    $(pieChart.series[0].data).each(function(i, slice){
        $(slice.legendSymbol.element).attr('stroke-width','1');
        $(slice.legendSymbol.element).attr('stroke',  '#00bbdb');

    });

}

function buildWordFrequencyChart(data) {
    var freqData = [];
    var catData = [];

    for (var i=0; i<data.length; ++i) {
        freqData.push(data[i].freqs);
        catData.push(data[i].words);
    }
    console.log(catData);
    console.log(freqData);


    var barChart = new Highcharts.Chart(
        {
            plotOptions: {
                bar: {
                    pointPadding: 0.0
                }
            },
            chart: {
                renderTo: 'wordFreqChart',
                type: 'bar'
            },
            title: {
                text: 'Word frequencies'
            },
            xAxis: {
                categories: catData,
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                  text: null
                },
                labels: {
                    overflow: 'justify'
                }
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },

            credits: {
                enabled: false
            },
            series: [{
                name: 'Year 1800',
                color: '#17ACD2',
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
