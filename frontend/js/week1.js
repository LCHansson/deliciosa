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
    window.loveWords = [];

    $('#textModalID').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        var filename = "data/lyrics/" + button.attr('id') + "_lyrics.json";
        var modal = $(this);
        modal.find('.modal-title').html("");
        modal.find('.modal-body').html("");

        $.ajax({
            async: false,
            type: "POST",
            url: filename,
            dataType: "json",
            success: function(response) {
                if (button.attr("data-hl-lovewords") == "true") {
                    var text = formatSongTexts(response.lyrics, loveWords);
                } else {
                    var text = formatSongTexts(response.lyrics, []);
                }

                modal.find('.modal-title').html(response.song_name);
                modal.find('.modal-body').html(text);
                return false;
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("Error!" + textStatus   );
                return true;
            }
        });

    });

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


}

function onClickSongName(element) {
    var filename = "data/lyrics/" + $(element).attr('id') + "_lyrics.json";
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
        regexp = new RegExp(loveWords[i] +"(\\W+|$)", "ig");
        formattedText = formattedText.replace(regexp, "<span style='color: #00bbdb'>" + loveWords[i] + "</span>$1");
    }

    return formattedText;
}

function buildCountsTable(loveWords) {

    // the table
    var myTable = $('#loveWordsTable').dataTable({
        dom: 'flitp',
        pageLength: 25,
        paging: true,
        order: [[1, "desc"]],
        info: false,
        searching: true,
        bProcessing: true,
        info : false,
        lengthChange: false,
        language: {
            paginate: {
                next: "nästa sida",
                previous: "föregående sida"
            },
            search: "Sök:"
        },
        sAjaxSource: "./data/texterna_sent_lovew_counts.json",

        aoColumns: [

            {
                sClass: "alignTextLeft",
                aTargets: [0],
                bSortable: false,
                sTitle: "Låt",
                searchable: true,
                "mRender": function (songName, type, row) {
                    var button = '<button type="button" class="btn btn-link" data-toggle="modal" ';
                    button += 'data-target="#textModalID" data-hl-lovewords="true" id="' + row[3] + '" ';
                    button += '>';
                    button += songName + '</button>';

                    return button;
                }
            },
            //{
            //    sClass: "alignTextLeft",
            //    aTargets: [1],
            //    bSortable: true,
            //    sTitle: "Låt",
            //    "mRender": function (songName, type, row) {
            //        var button = '<button type="button" class="btn btn-link" data-toggle="modal" ';
            //        button += 'data-target="#textModalID" id="' + row[4] + '" ';
            //        button += '>';
            //        button += songName + '</button>';
            //
            //        return button;
            //    }
            //},
            //{
            //    sClass: "alignTextLeft",
            //    aTargets: [2],
            //    bSortable: true,
            //    sTitle: "År"
            //},
            {
                sClass: "alignTextRight",
                aTargets: [1],
                bSortable: true,
                aDataSort: [1],
                searchable: true,
                sTitle: "Antal kärleksord"
            },
            {
                sClass: "alignTextRight",
                aTargets: [2],
                bSortable: true,
                aDataSort: [2],
                searchable: true,
                sTitle: "Glädjepoäng"
            },
            {
                aTargets: [3],
                bVisible: false,
                searchable: false
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


    // build the table
    $.ajax({
        type: "POST",
        url: "./data/love_words.json",
        dataType: "json",
        success: function (response) {
            window.loveWords = response.love_words;
            buildCountsTable(response.love_words);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus);
        }
    });


 }
