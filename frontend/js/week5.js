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

function week5() {
    $.ajax({
        type: "GET",
        url: "./data/love_words.json",
        dataType: "json",
        success: function (response) {
            window.loveWords = response.love_words;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus);
        }
    });

    //$('#textModalID').on('show.bs.modal', function (event) {
    //    var button = $(event.relatedTarget); // Button that triggered the modal
    //    var filename = "data/lyrics/" + button.attr('id') + "_lyrics.json";
    //    var modal = $(this);
    //    modal.find('.modal-title').html("");
    //    modal.find('.modal-body').html("");
    //    modal.find('.modal-meta').html("");
    //
    //
    //    window.location.hash = "textmodal";
    //    window.onhashchange = function() {
    //        if (!location.hash){
    //            modal.modal('hide');
    //        }
    //    }
    //
    //
    //
    //    $.ajax({
    //        async: false,
    //        type: "GET",
    //        url: filename,
    //        dataType: "json",
    //        success: function(response) {
    //            var text = formatSongTexts(response.lyrics, loveWords);
    //
    //
    //            modal.find('.modal-title').html(response.song_name);
    //            modal.find('.modal-body').html(text);
    //            var meta = "Kärleksord i blått.<br>" +
    //                "Antal kärleksord: " + response.no_love_words +"<br>" +
    //                "Glädjepoäng: " + response.happy_score;
    //            modal.find('.modal-meta').html(meta);
    //            //window.location.hash = "text";
    //            return false;
    //        },
    //        error: function(jqXHR, textStatus, errorThrown) {
    //            console.log("Error!" + textStatus   );
    //            return true;
    //        }
    //    });
    //
    //});

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

    // make the bar chart
    //$.ajax({
    //    type: "GET",
    //    url: "./data/texterna_wordfreqs.json",
    //    dataType: "json",
    //    success: function (response) {
    //        buildWordFrequencyChart(response);
    //    },
    //    error: function (jqXHR, textStatus, errorThrown) {
    //        console.log("Error!" + textStatus);
    //    }
    //});


}