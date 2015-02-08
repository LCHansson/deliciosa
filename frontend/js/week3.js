/**
 * Created by luminitamoruz on 30/01/15.
 */

function buildTmArtistsPiechart(data, whereToRender, titleText, subtitleText) {

    var formattedData = [];
    var colPat = {
        pattern: 'images/pattern-yellow.png',
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
    $('#tmModalID').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        var filename = "data/tm/" + button.attr('id') + ".json";
        var modal = $(this);
        modal.find('.modal-title').html("");
        modal.find('.modal-body').html(button.attr('id'));
        modal.find('.modal-meta').html("");

        /*

         var button = $(event.relatedTarget); // Button that triggered the modal
         var filename = "data/lyrics/" + button.attr('id') + "_lyrics.json";
         var modal = $(this);



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
         }*/
    });

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
                searchable: true,
                "mRender": function (tm, type, row) {
                    var link = '<a href="" data-toggle="modal" data-target="#tmModalID" ';
                    link += 'id="' + row[6] + '">';
                    link += tm + '</a>';
                    return link;
                }
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

/*
function buildScatterPlot(data) {
   var s1 = [], s2 = [];

   for (var i=0; i<2; ++i) {
       for (var j=0; j<data[i].length; ++j) {
           if (i == 0) {
               s1.push([data[i][j].categ, data[i][j].val]);
           } else {
               s2.push([data[i][j].categ, data[i][j].val]);
           }
       }
   }

    $('#tmMFDiff').highcharts({
        plotOptions: {
            series: {
                enableMouseTracking: false
            }
        },
        title: {
            text: 'Skillnad mellan antal låtar skrivna av endast kvinnor och endast män',
            x: -20 //center
        },
        subtitle: {
            text: '2002-2014',
            x: -20
        },
        //xAxis: {
        //    categories: x1
        //},
        yAxis: {
            min: 0,
            title: {
                text: '#mänlåtar - #kvinnolåtar'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: ' låtar',
            headerFormat: '',
            pointFormat: '{point.x}: {point.y}'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0,

        },
        series: [{
            color: '#fdba00 ',
            name: 'Data mellan 2002-2014',
            data: s1,
            marker: {
                radius: 6
            },
            enableMouseTracking: true
        }, {
            color: '#808080',
            name: 'Regression line',
            data: s2,
            marker: {
                enabled: false
            }

        }]
    });
    console.log(s1)
    console.log(s2)


}
*/

function buildScatterPlot(data) {
    var s1 = [], s2 = [], s3 = [];

    for (var i=0; i<3; ++i) {
        for (var j=0; j<data[i].length; ++j) {
            if (i == 0) {
                s1.push([data[i][j].categ, data[i][j].val]);
            }
            if (i == 1) {
                s2.push([data[i][j].categ, data[i][j].val]);
            }
            if (i == 2) {
                s3.push([data[i][j].categ, data[i][j].val]);
            }
        }
    }


    $('#tmMFDiff').highcharts({
        chart: {
            type: 'area'
        },
        plotOptions: {
            area: {
                stacking: 'percent'
            }
        },
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        },

        title: {
            text: 'Antal låtar skrivna av endast kvinnor, mixt grupp och endast män 2002-2014',
            x: -20 //center
        },
        subtitle: {
            text: '',
            x: -20
        },
        //xAxis: {
        //    categories: x1
        //},
        yAxis: {
            min: 0,
            title: {
                text: 'Andel låtar'
            },
            plotLines: [{
                value: 0,
                width: 10
            }, {
                value: 0,
                width: 1
            }, {
                value: 0,
                width: 1
            }]
        },
        tooltip: {
            headerFormat: '',
            pointFormat: '{point.x}: {point.y:.0f}%'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0

        },
        series: [
            {
                color: '#000000',
                name: 'Kvinnor',
                data: s2,
                marker: {
                    symbol: "circle",
                    radius: 0
                }
            },
            {
                color: '#808080',
                name: 'Mixt',
                data: s3,
                marker: {
                    symbol: "circle",
                    radius: 0
                }
            },
            {
            color: '#fdba00',
            name: 'Män',
            data: s1,
            marker: {
                symbol: "circle",
                radius: 0
            },
            enableMouseTracking: true
        }]
    });
}


function week3Collapse() {
    // build the table
    $.ajax({
        type: "GET",
        url: "./data/tm_extra_mbf.json",
        dataType: "json",
        success: function (response) {
            buildScatterPlot(response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus);
        }
    });

}

$(function () {
    var firstPostLoaded = false;
    var thirdPostLoaded = false;
    $('.read-on').on('click', function(e) {
        e.preventDefault();
        var $this = $(this);
        var $collapse = $this.closest('.collapse-group').find('.collapse');
        $this.toggleClass('up');
        $this.toggleClass('down');
        $collapse.collapse('toggle');

        var postNr = $this.closest('.collapse-group').attr("data-post")
        if (!firstPostLoaded & postNr == 1){
            week1Collapse();
            firstPostLoaded = true;
        }
        if (!thirdPostLoaded & postNr == 3){
            week3Collapse();
            thirdPostLoaded = true;
        }
    });

    $( ".nav-pills" ).find( "a" ).on( "show.bs.tab", function( e ){
        if ( window.innerWidth >= 768 ) {
            e.preventDefault();
        }
    });

    week1();
    week3();

    window.fbShare = function(){
        FB.ui(
            {
                method: 'share',
                href: 'https://developers.facebook.com/docs/'
            }, function(response){});
        return false;
    }
});
