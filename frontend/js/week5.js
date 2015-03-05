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
    var chartHeight = 250,
        pieSize = 100;

    if ( window.innerWidth <= 768 ){
        chartHeight = 300;
        pieSize = 150;
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
            height: chartHeight
        },
        legend: {
            layout: 'vertical'
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
                size: pieSize,
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
function buildBpmBar15(data) {
    var winnerData = [];
    var categories = [];

    // Data munge
    // Histogram
    for (var i=0; i<data.tempos.length; ++i) {
        winnerData.push({
            name: data.tempos[i].tempo,
            y: data.tempos[i].winners
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
                renderTo: 'bpmBar15',
                height: 250,
                backgroundColor: 'rgba(255,255,255,0)'
            },
            title: {
                text: ''
            },
            subtitle: {
                text: 'Tempo'
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
                    enabled: true
                },
                tickLength: 0,
                tickWidth: 0,
                lineWidth: 0,
                plotLines: [{
                    color: '#ed4d17', // Color value
                    dashStyle: 'solid', // Style of the plot line. Default to solid
                    value: 9.5, // Value of where the line will appear
                    width: 4, // Width of the line
                    label: {
                        rotation: 0,
                        text: 'Måns och Eric:<br/>124 BPM', // Content of the label.
                        align: 'left', // Positioning of the label. Default to center.
                        x: +10 // Amount of pixels the label will be repositioned according to the alignment.
                    }
                }]
            },
            yAxis: {
                min: 0,
                max: 0.40,
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
                                //pHPlay(this);
                            },
                            mouseOut: function(){
                                //pHStop();
                            },
                            click: function(){
                                //pHPlay(this);
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

}

function buildNoiseBar15() {
    var barChart = new Highcharts.Chart(
        {
            exporting: {
                enabled: false
            },
            chart: {
                renderTo: 'noiseBar15',
                type: 'column',
                height: 250
            },
            title: {
                text: ''
            },
            subtitle: {
                text: "Skrikighet"
            },
            legend: {
                enabled: false
            },
            xAxis: {
                categories: [ "Måns/Eric", "Vinnare", "Förlorare" ],
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
                //plotLines: [{
                //    color: '#ed4d17', // Color value
                //    dashStyle: 'solid', // Style of the plot line. Default to solid
                //    value: 5.8, // Value of where the line will appear
                //    width: 4, // Width of the line
                //    label: {
                //        rotation: 0,
                //        text: 'Måns och Eric:<br/>-4,2 dB', // Content of the label.
                //        align: 'left', // Positioning of the label. Default to center.
                //        x: +10 // Amount of pixels the label will be repositioned according to the alignment.
                //    }
                //}]

            },
            plotOptions: {
                column: {
                    pointPadding: 0
                }
            },
            tooltip: {
                formatter: function () {
                    //return 'Genomsnittligt <em>noise</em> för<br/><b>' + this.x + '</b>: ' + this.y + ' dB';
                    return this.x + ' har i snitt ett <br/><em>noise</em> på <b>' + (this.y - 10).toPrecision(2) + 'dB</b>';
                }
                //pointFormat: '<b>{point.y}</b>'
            },

            credits: {
                enabled: false
            },
            series: [
                {
                    color: 'grey',
                    data: [0, 0, 10 + (-5.7418)],
                    grouping: false,
                    name: ""
                },
                {
                    color: '#6e328f',
                    data: [0, 10 + (-4.7349), 0],
                    grouping: false,
                    name: ""
                },
                {
                    color: '#ed4d17',
                    data: [10 + (-3.927), 0, 0],
                    grouping: false,
                    name: ""
                }]
        }
    );
}

/* Låtskrivarna */
function buildSexPieChart(data, whereToRender, titleText, subtitleText, hexcol, color, addcateg) {

    var addcateg = addcateg || false;

    var formattedData = [];
    var colPat = {
        pattern: 'images/pattern-' + color + '.png',
        width: 5,
        height: 5
    };
    var colPatDots = {
        pattern: 'images/pattern-dots-orange.png',
        width: 7,
        height: 7
    };
    var colors = [hexcol, colPat, colPatDots, '#FFFFFF'];
    if ( data.length < 4 ){
        colors = [hexcol, colPat, '#FFFFFF'];
    }

    for (var i=0; i<data.length; ++i) {
        formattedData.push({
            color: colors[i],
            name: data[i].categ_name,
            y: data[i].val
        });
    }

    var chartHeight = 250,
        pieSize = 100;

    if ( window.innerWidth <= 768 ){
        chartHeight = 300;
        pieSize = 150;
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
            plotShadow: false,
            height: chartHeight
        },
        legend: {
            layout: 'vertical'
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
                size: pieSize,
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
        type: "POST",
        url: "./data/songs_tempo.json",
        dataType: "json",
        success: function(response) {
            buildBpmBar15(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus   );
        }
    });

    buildNoiseBar15();

    $.ajax({
        type: "GET",
        url: "./data/tm_tm_gender_imbalance.json",
        dataType: "json",
        success: function (response) {
            buildSexPieChart(response, 'sexFigures14', '', '2002-2014', '#fdba00', 'yellow');
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
            buildSexPieChart(response, 'sexFigures15', '', '2015', '#ed4d17', 'orange', true);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus);
        }
    });
}