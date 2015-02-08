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

function buildTmTable() {

    // the table
    var mytmTable = $('#tmTable').DataTable({
        dom: 'litp',
        pageLength: 10,
        paging: false,
        order: [[1, "desc"]],
        info: false,
        searching: false,
        bProcessing: true,
        lengthChange: false,
        autoWidth: false,
        language: {
            loadingRecords: "Laddar ..."
        },
        sAjaxSource: "./data/tm_10_heroes.json",

        aoColumns: [
            {
                sClass: "text",
                aTargets: [0],
                bSortable: true,
                sTitle: "Låtskrivare",
                searchable: true
                /*
                "mRender": function (songName, type, row) {
                    var link = '<a href="" data-toggle="modal" data-target="#textModalID" '
                    link += 'data-hl-lovewords="true" id="' + row[3] + '">';
                    link += songName + '</a>';
                    return link;
                }*/
            },
            {
                sClass: "count",
                aTargets: [1],
                bSortable: true,
                aDataSort: [1],
                searchable: true,
                sTitle: "Antal låtar"
            },
            {
                sClass: "count",
                aTargets: [2],
                bSortable: true,
                aDataSort: [2],
                searchable: true,
                sTitle: "Antal låtar i finalen",
                "mRender": function (antal, type, row) {
                    var v = '' + antal + ' (' + row[4].toFixed(0) + '%)';
                    return v;
                }
            },
            {
                sClass: "count",
                aTargets: [3],
                bSortable: true,
                aDataSort: [3],
                searchable: true,
                sTitle: "Antal vinnande låtar",
                "mRender": function (a, type, row) {
                    var v = '' + a + ' (' + row[5].toFixed(0) + '%)';
                    return v;
                }
            }
        ]
    });

}

function week3() {
    $.ajax({
        type: "GET",
        url: "./data/tm_artists_gender_imbalance.json",
        dataType: "json",
        success: function (response) {
            buildTmArtistsPiechart(response, 'tmArtistsPieChart', 'Artisterna', 'Andel låtar uppträdade av män, mixt och kvinno artister');
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
            buildTmArtistsPiechart(response, 'tmTmPieChart', 'Låtskrivarna', 'Andel låtar skrivna av män, mixt och kvinno låtskrivare');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus);
        }
    });

    buildTmTable();
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