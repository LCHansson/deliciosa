/* Texterna */

function buildLovePie(data, container, color, pattern, title, subtitle, legend_align) {

    var container = container || 'lovePie14';
    var color = color || '#00bbdb';
    var pattern = pattern || 'blue';
    var title = title || '';
    var subtitle = subtitle || '';
    var legend_align = legend_align || 'left';

    var formattedData = [];
    var colPat = {
        pattern: 'images/pattern-' + pattern + '.png',
        width: 5,
        height: 5
    };
    var colors = [color, colPat, '#FFFFFF'];

    for (var i=0; i<data.length; ++i) {
        formattedData.push({
            color: colors[i],
            name: data[i].name,
            y: data[i].freq
        });
    }

    var pieChart = new Highcharts.Chart({
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        chart: {
            renderTo: container,
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            height: 230
        },
        title: {
            text: title
        },
        subtitle: {
            text: subtitle
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b>'
        },
        //legend: {
        //    layout: 'vertical',
        //    align: legend_align,
        //    verticalAlign: 'middle'
        //},
        //legend: {y: -30},
        //credits: {
        //    text: "Baserad på en analys av 391 sångtexter från Melodifestivalen 2002-2014"
        //},
        plotOptions: {
            pie: {
                borderColor: color,
                borderWidth: 2,
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true,
                point: {
                    events: {
                        legendItemClick: function () {
                            return false; // <== returning false will cancel the default action
                        }
                    }
                }
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
                                stroke: color
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
        $(slice.legendSymbol.element).attr('stroke',  color);

    });

}

/* Låtarna */


/* Låtskrivarna */
function buildSexPieChart(data, whereToRender, titleText, subtitleText, hexcol, color, addcateg) {

    var addcateg = addcateg || false;

    var formattedData = [];
    var colPat = {
        pattern: 'images/pattern-' + color + '.png',
        width: 5,
        height: 5
    };
    var colors = [hexcol, colPat, '#FFFFFF'];

    for (var i=0; i<data.length; ++i) {
        formattedData.push({
            color: colors[i],
            name: data[i].categ_name,
            y: data[i].val
        });
    }

    var pieChart = new Highcharts.Chart({
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        chart: {
            renderTo: whereToRender,
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: titleText
        },
        subtitle: {
            text: subtitleText
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                borderColor: hexcol,
                borderWidth: 2,
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true,
                point: {
                    events: {
                        legendItemClick: function () {
                            return false; // <== returning false will cancel the default action
                        }
                    }
                }
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
                                stroke: hexcol
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
        $(slice.legendSymbol.element).attr('stroke',  hexcol);

    });
}


/* Init */
function week5() {

    $.ajax({
        type: "GET",
        url: "./data/texterna_loveprops.json",
        dataType: "json",
        success: function(response) {
            buildLovePie(response, 'lovePie14', '#00bbdb', 'blue', '', '2002-2014');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus   );
        }
    });

    $.ajax({
        type: "GET",
        url: "./data/texterna_loveprops15.json",
        dataType: "json",
        success: function(response) {
            buildLovePie(response, 'lovePie15', '#ed4d17', 'orange', '', '2015', 'right');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus   );
        }
    });

    $.ajax({
        type: "GET",
        url: "./data/tm_tm_gender_imbalance.json",
        dataType: "json",
        success: function (response) {
            buildSexPieChart(response, 'sexFigures14', '2002-2014', 'Fördelning av låtar efter kön på låtskrivaren/låtskrivarna', '#fdba00', 'yellow');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus);
        }
    });

    $.ajax({
        type: "GET",
        url: "./data/tm_tm_gender_imbalance15.json",
        dataType: "json",
        success: function (response) {
            buildSexPieChart(response, 'sexFigures15', '2015', 'Fördelning av låtar efter kön på låtskrivaren/låtskrivarna', '#ed4d17', 'orange', true);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus);
        }
    });

}