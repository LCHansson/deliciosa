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
        exporting: {
            enabled: false
        },
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
        subtitle: {
            text: 'Andel låtar som handlade om kärlek 2002-2014'
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b>'
        },
        //legend: {y: -20},
        //credits: {
        //    text: "Baserad på en analys av 391 sångtexter från Melodifestivalen 2002-2014"
        //},
        plotOptions: {
            pie: {
                borderColor: '#00bbdb',
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
            exporting: {
                enabled: false
            },
            chart: {
                renderTo: 'wordFreqChart',
                type: 'bar'
            },
            title: {
                text: 'Vanligaste kärleksorden'
            },
            subtitle: {
                text: 'Antal gånger ett kärleksord nämndes 2002-2014'
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
                //labels: {
                //    enabled: false
                //},
                tickLength: 0,
                tickWidth: 0,
                lineWidth: 0
            },
            yAxis: {
                min: 0,
                title: {
                  text: null
                },
                //labels: {
                //    overflow: 'justify'
                //},
                labels: {
                    enabled: false
                },
                gridLineWidth: 0.0,
                tickLength: 5,
                tickWidth: 0,
                tickColor: '#000000',
                tickInterval: 250,

                endOnTick: false,
                max: 1000
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
                    },
                    borderWidth: 7
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

function buildSmallPiechart(data, title, subtitle, whereToRender) {

    var formattedData = [];
    var colPat = {
        pattern: 'images/pattern-blue.png',
        width: 5,
        height: 5
    };
    if (data.length == 2) {
        var colors = ['#00bbdb', '#FFFFFF'];
    } else {
        var colors = ['#00bbdb', colPat, '#FFFFFF', "#064b23"];
    }

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
            renderTo: whereToRender,
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
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
        plotOptions: {
            pie: {
                borderColor: '#00bbdb',
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

function week1(){
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

    $('#textModalID').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        var filename = "data/lyrics/" + button.attr('id') + "_lyrics.json";
        var modal = $(this);
        modal.find('.modal-title').html("");
        modal.find('.modal-body').html("");
        modal.find('.modal-meta').html("");


        window.location.hash = "textmodal";
        window.onhashchange = function() {
            if (!location.hash){
                modal.modal('hide');
            }
        }



        $.ajax({
            async: false,
            type: "GET",
            url: filename,
            dataType: "json",
            success: function(response) {
                var text = formatSongTexts(response.lyrics, loveWords);


                modal.find('.modal-title').html(response.song_name);
                modal.find('.modal-body').html(text);
                var meta = "Kärleksord i blått.<br>" +
                    "Antal kärleksord: " + response.no_love_words +"<br>" +
                    "Glädjepoäng: " + response.happy_score;
                modal.find('.modal-meta').html(meta);
                //window.location.hash = "text";
                return false;
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("Error!" + textStatus   );
                return true;
            }
        });

    });

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

    // make the bar chart
    $.ajax({
        type: "GET",
        url: "./data/texterna_wordfreqs.json",
        dataType: "json",
        success: function (response) {
            buildWordFrequencyChart(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus);
        }
    });


}

function onClickSongName(element) {
    var filename = "data/lyrics/" + $(element).attr('id') + "_lyrics.json";
    $.ajax({
        type: "GET",
        url: filename,
        dataType: "json",
        success: function(response) {
            var text = response.lyrics;
            $("#textModalID").html(text);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus   );
        }
    });
}

function formatSongTexts(text, loveWords) {
    var formattedText = text.replace(/\n/g, " <br> ");
    var regexp;
    for (var i=0; i<loveWords.length; ++i) {
        regexp = new RegExp(loveWords[i] +"(\\W+|$)", "ig");
        formattedText = formattedText.replace(regexp, "<span style='color: #00bbdb'>" + loveWords[i] + "</span>$1");
    }

    return formattedText;
}

function buildCountsTable() {
// the table
    var myTable = $('#loveWordsTable').DataTable({
        dom: 'litp',
        pageLength: 10,
        paging: true,
        order: [[1, "desc"]],
        info: false,
        searching: false,
        bProcessing: true,
        info : false,
        lengthChange: false,
        autoWidth: false,
        language: {
            paginate: {
                next: "▶",
                previous: "◀"
            },
            loadingRecords: "Laddar ..."
        },
        sAjaxSource: "./data/texterna_sent_lovew_counts.json",
        aoColumns: [
            {
                sClass: "text",
                aTargets: [0],
                bSortable: true,
                sTitle: "Låt",
                searchable: true,
                "mRender": function (songName, type, row) {
                    var link = '<a href="" data-toggle="modal" data-target="#textModalID" '
                    link += 'data-hl-lovewords="true" id="' + row[3] + '">';
                    link += songName + '</a>';
                    return songName;
                }
            },
            {
                sClass: "count",
                aTargets: [1],
                bSortable: true,
                aDataSort: [1],
                searchable: true,
                sTitle: "Antal kärleksord"
            },
            {
                sClass: "count",
                aTargets: [2],
                bSortable: true,
                aDataSort: [2],
                searchable: true,
                sTitle: "Glädjepoäng"
            }
        ]
    });
}

function week1Collapse() {
    // build the table
    buildCountsTable();
 }
