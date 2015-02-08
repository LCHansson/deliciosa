/**
 * Created by luminitamoruz on 30/01/15.
 */

function buildTmArtistsPiechart(data, whereToRender, titleText, subtitleText) {

    var formattedData = [];
    var colPat = {
        pattern: 'images/pattern-blue.png',
        width: 5,
        height: 5
    };
    var colors = ['#fdba00', colPat, '#FFFFFF'];

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
                borderColor: '#fdba00',
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
                                stroke: '#fdba00'
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
        $(slice.legendSymbol.element).attr('stroke',  '#fdba00');

    });
}

function week3() {
    $.ajax({
        type: "GET",
        url: "./data/tm_artists_gender_imbalance.json",
        dataType: "json",
        success: function (response) {
            buildTmArtistsPiechart(response, 'tmArtistsPieChart', 'Artisterna', 'Andel män, mixt och kvinno artister');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus);
        }
    });

    $.ajax({
        type: "GET",
        url: "./data/tm_tm_gender_imbalance.json",
        dataType: "json",
        success: function (response) {
            buildTmArtistsPiechart(response, 'tmTmPieChart', 'Låtskrivarna', 'Andel män, mixt och kvinno låtskrivare');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus);
        }
    });

    /*
    console.log("Before");
    sigma.parsers.json('data/arctic.json', {
        container: 'tmGraph',
        settings: {
            defaultNodeColor: '#ec5148'
        }
    });
    console.log("After");
    */

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

    week3();
});