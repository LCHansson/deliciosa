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
            exporting: {
                enabled: false
            },
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

function buildSmallPiechart(data, title, whereToRender) {

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

function week1(){
    $.ajax({
        type: "POST",
        url: "./data/texterna_loveprops.json",
        dataType: "json",
        success: function(response) {
            buildLovePiechart(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus   );
        }
    });
}

function onClickSongName(element) {
    var filename = "data/lyrics/" + $(element).attr('id') + "_lyrics.json";
    console.log("You clicked " + $(element).attr('id'));
    $.ajax({
        type: "POST",
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
        regexp = new RegExp(loveWords[i] +"(\\W+)", "ig");
        formattedText = formattedText.replace(regexp, "<span style='color: #00bbdb'>" + loveWords[i] + "</span>$1");
    }

    return formattedText;
}

function buildCountsTable(loveWords) {
    $('#textModalID').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        var filename = "data/lyrics/" + button.attr('id') + "_lyrics.json";
        var modal = $(this);
        modal.find('.modal-title').html("");
        modal.find('.modal-body').html("");

        $.ajax({
            type: "POST",
            url: filename,
            dataType: "json",
            success: function(response) {
                var text = formatSongTexts(response.lyrics, loveWords);
                modal.find('.modal-title').html(response.song_name);
                modal.find('.modal-body').html(text);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("Error!" + textStatus   );
            }
        });

    });

    // the table
    var myTable = $('#loveWordsTable').dataTable({
        order: [[3, "desc"]],
        info: false,
        searching: false,
        bProcessing: true,
        sAjaxSource: "./data/texterna_lovecounts_datatables.json",
        aoColumns: [

            {
                sClass: "alignTextLeft",
                aTargets: [0],
                bSortable: true,
                sTitle: "Artist"
            },
            {
                sClass: "alignTextLeft",
                aTargets: [1],
                bSortable: true,
                sTitle: "Låt",
                "mRender": function (songName, type, row) {
                    var button = '<button type="button" class="btn btn-link" data-toggle="modal" ';
                    button += 'data-target="#textModalID" id="' + row[4] + '" ';
                    button += '>';
                    button += songName + '</button>';

                    return button;
                }
            },
            {
                sClass: "alignTextLeft",
                aTargets: [2],
                bSortable: true,
                sTitle: "År"
            },
            {
                sClass: "alignTextRight",
                aTargets: [3],
                bSortable: true,
                aDataSort: [3, 2],
                sTitle: "Antal kärleksord"
            },
            {
                aTargets: [4],
                bVisible: false
            }
        ]
        /*
         "fnInitComplete": function (){
         $(myTable.fnGetNodes()).click(function (){
         console.log("Bla");
         });
         }*/
    });

}

function week1Collapse() {
    // make the bar chart
    $.ajax({
        type: "POST",
        url: "./data/texterna_wordfreqs.json",
        dataType: "json",
        success: function (response) {
            buildWordFrequencyChart(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus);
        }
    });

    // make the other pie charts
    smallPies = [
        {
            filename: "./data/texterna_seasons.json",
            title: "Årstider",
            divToRender: "seasonPieChart"
        },
        {
            filename: "./data/texterna_aventyr.json",
            title: "Äventyr",
            divToRender: "adventurePieChart"
        },
        {
            filename: "./data/texterna_religion.json",
            title: "Ödermarken",
            divToRender: "religionPieChart"
        }
    ]

    for (var i = 0; i < smallPies.length; i++) {
        (function (i) {
            $.ajax({
                type: "POST",
                url: smallPies[i].filename,
                dataType: "json",
                success: function (response) {
                    buildSmallPiechart(response, smallPies[i].title, smallPies[i].divToRender);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("Error!" + textStatus);
                }
            });
        })(i);
    }

    // build the table
    $.ajax({
        type: "POST",
        url: "./data/love_words.json",
        dataType: "json",
        success: function (response) {
            buildCountsTable(response.love_words);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus);
        }
    });



 }
