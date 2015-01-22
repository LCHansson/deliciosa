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
                borderColor: '#17ACD2',
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
                        color: '#17ACD2',
                        name: 'Kärlek'
                    },
                    {
                        y: data["Lite kärlek"][0],
                        color: {
                            pattern: 'images/pattern-blue.png',
                            width: 40,
                            height: 40
                        },
                        name: 'Lite kärlek'
                    },
                    {
                        y: data["Inte kärlek"][0],
                        color: '#FFFFFF',
                        name: 'Ingen kärlek',
                    }
                ]
            }]
    });

    $(pieChart.series[0].data).each(function(i, slice){
        $(slice.legendSymbol.element).attr('stroke-width','1');
        $(slice.legendSymbol.element).attr('stroke',  '#17ACD2');

    });

}


// pie chart about love songs
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
}
