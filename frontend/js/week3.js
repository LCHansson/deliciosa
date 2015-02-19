/**
 * Created by luminitamoruz on 30/01/15.
 */


var Network, RadialPlacement, activate, root;

root = typeof exports !== "undefined" && exports !== null ? exports : this;

RadialPlacement = function() {
    var center, current, increment, place, placement, radialLocation, radius, setKeys, start, values;
    values = d3.map();
    increment = 20;
    radius = 200;
    center = {
        "x": 0,
        "y": 0
    };
    start = -120;
    current = start;
    radialLocation = function(center, angle, radius) {
        var x, y;
        x = center.x + radius * Math.cos(angle * Math.PI / 180);
        y = center.y + radius * Math.sin(angle * Math.PI / 180);
        return {
            "x": x,
            "y": y
        };
    };
    placement = function(key) {
        var value;
        value = values.get(key);
        if (!values.has(key)) {
            value = place(key);
        }
        return value;
    };
    place = function(key) {
        var value;
        value = radialLocation(center, current, radius);
        values.set(key, value);
        current += increment;
        return value;
    };
    setKeys = function(keys) {
        var firstCircleCount, firstCircleKeys, secondCircleKeys;
        values = d3.map();
        firstCircleCount = 360 / increment;
        if (keys.length < firstCircleCount) {
            increment = 360 / keys.length;
        }
        firstCircleKeys = keys.slice(0, firstCircleCount);
        firstCircleKeys.forEach(function(k) {
            return place(k);
        });
        secondCircleKeys = keys.slice(firstCircleCount);
        radius = radius + radius / 1.8;
        increment = 360 / secondCircleKeys.length;
        return secondCircleKeys.forEach(function(k) {
            return place(k);
        });
    };
    placement.keys = function(_) {
        if (!arguments.length) {
            return d3.keys(values);
        }
        setKeys(_);
        return placement;
    };
    placement.center = function(_) {
        if (!arguments.length) {
            return center;
        }
        center = _;
        return placement;
    };
    placement.radius = function(_) {
        if (!arguments.length) {
            return radius;
        }
        radius = _;
        return placement;
    };
    placement.start = function(_) {
        if (!arguments.length) {
            return start;
        }
        start = _;
        current = start;
        return placement;
    };
    placement.increment = function(_) {
        if (!arguments.length) {
            return increment;
        }
        increment = _;
        return placement;
    };
    return placement;
};

Network = function() {
    var allData, charge, curLinksData, curNodesData, filter, filterLinks, filterNodes, force, forceTick, groupCenters, height, hideDetails, layout, link, linkedByIndex, linksG, mapNodes, moveToRadialLayout, neighboring, network, node, nodeColors, nodeCounts, nodesG, radialTick, setFilter, setLayout, setSort, setupData, showDetails, sort, sortedArtists, strokeFor, tooltip, update, updateCenters, updateLinks, updateNodes, width;
    width = 960;
    height = 600;
    allData = [];
    curLinksData = [];
    curNodesData = [];
    linkedByIndex = {};
    nodesG = null;
    linksG = null;
    node = null;
    link = null;
    layout = "force";
    filter = "all";
    sort = "songs";
    groupCenters = null;
    force = d3.layout.force();
    //nodeColors = d3.scale.category10();
    nodeColors = function( group ) {
        if (group == "Top 10") {
            return "#fdba00";
        } else if (group == "Samarbetade med någon i top 10") {
            return "#FFE664";
        } else {
            return d3.scale.category10()(group);
        }
    }
    var nodes = [/*{
        index: 12,
        x: 100,
        y: 100,
        fixed: true
    }*/];
    tooltip = Tooltip("vis-tooltip", 230);
    charge = function(node) {
        return -Math.pow(node.radius, 2.0) / 2;
    };
    network = function(selection, data) {
        var vis;
        width = $("#vis").width();
        height = Math.max(width/3*2, 360);
        allData = setupData(data);
        vis = d3.select(selection).append("svg").attr("width", width).attr("height", height);
        linksG = vis.append("g").attr("id", "links");
        nodesG = vis.append("g").attr("id", "nodes");
        force.size([width, height]);
        setLayout("force");
        setFilter("all");
        return update();
    };
    update = function() {
        var artists;
        curNodesData = filterNodes(allData.nodes);
        curLinksData = filterLinks(allData.links, curNodesData);
        if (layout === "radial") {
            artists = sortedArtists(curNodesData, curLinksData);
            updateCenters(artists);
        }

        // positioning Bobby Ljungren
        curNodesData[12].x = width/16*4;
        curNodesData[12].y = height/2;
        curNodesData[12].fixed = true;

        // positioning Tobias Lundgren
        curNodesData[42].x = width/8*6;
        curNodesData[42].y = height/5*2;
        curNodesData[42].fixed = true;

        //console.log(curNodesData);
        force.nodes(curNodesData);
        updateNodes();
        if (layout === "force") {
            force.links(curLinksData);
            updateLinks();
        } else {
            force.links([]);
            if (link) {
                link.data([]).exit().remove();
                link = null;
            }
        }
        //var n = 100;
        //force.start();
        //for (var i = n * n; i > 0; --i) force.tick();

        return force.start(); //force.stop();;
    };
    network.toggleLayout = function(newLayout) {
        force.stop();
        setLayout(newLayout);
        return update();
    };
    network.toggleFilter = function(newFilter) {
        force.stop();
        setFilter(newFilter);
        return update();
    };
    network.toggleSort = function(newSort) {
        force.stop();
        setSort(newSort);
        return update();
    };
    network.updateSearch = function(searchTerm) {
        var searchRegEx;
        searchRegEx = new RegExp(searchTerm.toLowerCase());
        return node.each(function(d) {
            var element, match;
            element = d3.select(this);
            match = d.name.toLowerCase().search(searchRegEx);
            if (searchTerm.length > 0 && match >= 0) {
                element.style("fill", "#F38630").style("stroke-width", 2.0).style("stroke", "#555");
                return d.searched = true;
            } else {
                d.searched = false;
                return element.style("fill", function(d) {
                    return nodeColors(d.group);
                }).style("stroke-width", 1.0);
            }
        });
    };
    network.updateData = function(newData) {
        allData = setupData(newData);
        link.remove();
        node.remove();
        return update();
    };
    setupData = function(data) {
        var circleRadius, countExtent, nodesMap;
        countExtent = d3.extent(data.nodes, function(d) {
            return d.nsongs;
        });
        circleRadius = d3.scale.sqrt().range([5, 17]).domain(countExtent);
        data.nodes.forEach(function(n) {
            var randomnumber;
            n.x = randomnumber = Math.floor(Math.random() * width);
            n.y = randomnumber = Math.floor(Math.random() * height);
            return n.radius = circleRadius(n.nsongs);
        });
        nodesMap = mapNodes(data.nodes);
        data.links.forEach(function(l) {
            l.source = nodesMap.get(l.source);
            l.target = nodesMap.get(l.target);
            return linkedByIndex[l.source.id + "," + l.target.id] = 1;
        });
        return data;
    };
    mapNodes = function(nodes) {
        var nodesMap;
        nodesMap = d3.map();
        nodes.forEach(function(n) {
            return nodesMap.set(n.id, n);
        });
        return nodesMap;
    };
    nodeCounts = function(nodes, attr) {
        var counts;
        counts = {};
        nodes.forEach(function(d) {
            var _name;
            if (counts[_name = d[attr]] == null) {
                counts[_name] = 0;
            }
            return counts[d[attr]] += 1;
        });
        return counts;
    };
    neighboring = function(a, b) {
        return linkedByIndex[a.id + "," + b.id] || linkedByIndex[b.id + "," + a.id];
    };
    filterNodes = function(allNodes) {
        var cutoff, filteredNodes, playcounts;
        filteredNodes = allNodes;
        if (filter === "popular" || filter === "obscure") {
            playcounts = allNodes.map(function(d) {
                return d.nsongs;
            }).sort(d3.ascending);
            cutoff = d3.quantile(playcounts, 0.5);
            filteredNodes = allNodes.filter(function(n) {
                if (filter === "popular") {
                    return n.nsongs > cutoff;
                } else if (filter === "obscure") {
                    return n.nsongs <= cutoff;
                }
            });
        }
        return filteredNodes;
    };
    sortedArtists = function(nodes, links) {
        var artists, counts;
        artists = [];
        if (sort === "links") {
            counts = {};
            links.forEach(function(l) {
                var _name, _name1;
                if (counts[_name = l.source.group] == null) {
                    counts[_name] = 0;
                }
                counts[l.source.group] += 1;
                if (counts[_name1 = l.target.group] == null) {
                    counts[_name1] = 0;
                }
                return counts[l.target.group] += 1;
            });
            nodes.forEach(function(n) {
                var _name;
                return counts[_name = n.group] != null ? counts[_name] : counts[_name] = 0;
            });
            artists = d3.entries(counts).sort(function(a, b) {
                return b.value - a.value;
            });
            artists = artists.map(function(v) {
                return v.key;
            });
        } else {
            counts = nodeCounts(nodes, "artist");
            artists = d3.entries(counts).sort(function(a, b) {
                return b.value - a.value;
            });
            artists = artists.map(function(v) {
                return v.key;
            });
        }
        return artists;
    };
    updateCenters = function(artists) {
        if (layout === "radial") {
            return groupCenters = RadialPlacement().center({
                "x": width / 2,
                "y": height / 2 - 100
            }).radius(300).increment(18).keys(artists);
        }
    };
    filterLinks = function(allLinks, curNodes) {
        curNodes = mapNodes(curNodes);
        return allLinks.filter(function(l) {
            return curNodes.get(l.source.id) && curNodes.get(l.target.id);
        });
    };
    updateNodes = function() {
        node = nodesG.selectAll("circle.node").data(curNodesData, function(d) {
            return d.id;
        });
        node.enter().append("circle").attr("class", "node").attr("cx", function(d) {
            return d.x;
        }).attr("cy", function(d) {
            return d.y;
        }).attr("r", function(d) {
            return d.radius;
        }).style("fill", function(d) {
            return nodeColors(d.group);
        }).style("stroke", function(d) {
            return strokeFor(d);
        }).style("stroke-width", 1.0);
        node.on("mouseover", showDetails).on("mouseout", hideDetails);
        return node.exit().remove();
    };
    updateLinks = function() {
        link = linksG.selectAll("line.link").data(curLinksData, function(d) {
            return d.source.id + "_" + d.target.id;
        });
        link.enter().append("line").attr("class", "link").attr("stroke", "#ddd").attr("stroke-opacity", 0.8).attr("x1", function(d) {
            return d.source.x;
        }).attr("y1", function(d) {
            return d.source.y;
        }).attr("x2", function(d) {
            return d.target.x;
        }).attr("y2", function(d) {
            return d.target.y;
        });
        return link.exit().remove();
    };
    setLayout = function(newLayout) {
        layout = newLayout;
        if (layout === "force") {
            return force.on("tick", forceTick).charge(-width/3.4).linkDistance(width/11.1);
        } else if (layout === "radial") {
            return force.on("tick", radialTick).charge(charge);
        }
    };
    setFilter = function(newFilter) {
        return filter = newFilter;
    };
    setSort = function(newSort) {
        return sort = newSort;
    };
    forceTick = function(e) {
        node.attr("cx", function(d) {
            return d.x;
        }).attr("cy", function(d) {
            return d.y;
        });
        return link.attr("x1", function(d) {
            return d.source.x;
        }).attr("y1", function(d) {
            return d.source.y;
        }).attr("x2", function(d) {
            return d.target.x;
        }).attr("y2", function(d) {
            return d.target.y;
        });
    };
    radialTick = function(e) {
        node.each(moveToRadialLayout(e.alpha));
        node.attr("cx", function(d) {
            return d.x;
        }).attr("cy", function(d) {
            return d.y;
        });
        if (e.alpha < 0.03) {
            force.stop();
            return updateLinks();
        }
    };
    moveToRadialLayout = function(alpha) {
        var k;
        k = alpha * 0.1;
        return function(d) {
            var centerNode;
            centerNode = groupCenters(d.group);
            d.x += (centerNode.x - d.x) * k;
            return d.y += (centerNode.y - d.y) * k;
        };
    };
    strokeFor = function(d) {
        return d3.rgb(nodeColors(d.group)).darker().toString();
    };
    showDetails = function(d, i) {
        var content;
        content = '<div class="tooltip-header"><h4>' + d.name + '</h4></div>';
        content += '<div class="tooltip-body">' + d.nsongs + ' mellolåt';
        if (d.nsongs > 1){
            content += 'ar';
        }
        content += '</div>';
        tooltip.showTooltip(content, d3.event);
        if ( width <= 768 ){
            var offset = $("#vis").offset();
            //console.log(offset);
            tooltip.setPosition(offset.top - 120, offset.left + 20);
        }
        if (link) {
            link.attr("stroke", function(l) {
                if (l.source === d || l.target === d) {
                    return "#555";
                } else {
                    return "#ddd";
                }
            }).attr("stroke-opacity", function(l) {
                if (l.source === d || l.target === d) {
                    return 1.0;
                } else {
                    return 0.5;
                }
            });
        }
        node.style("stroke", function(n) {
            if (n.searched || neighboring(d, n)) {
                return "#555";
            } else {
                return strokeFor(n);
            }
        }).style("stroke-width", function(n) {
            if (n.searched || neighboring(d, n)) {
                return 2.0;
            } else {
                return 1.0;
            }
        });
        return d3.select(this).style("stroke", "black").style("stroke-width", 2.0);
    };
    hideDetails = function(d, i) {
        tooltip.hideTooltip();
        node.style("stroke", function(n) {
            if (!n.searched) {
                return strokeFor(n);
            } else {
                return "#555";
            }
        }).style("stroke-width", function(n) {
            if (!n.searched) {
                return 1.0;
            } else {
                return 2.0;
            }
        });
        if (link) {
            return link.attr("stroke", "#ddd").attr("stroke-opacity", 0.8);
        }
    };
    return network;
};



function buildNetwork() {
    var myNetwork = Network();
    $.ajax({
        type: "GET",
        url: "./data/tm_flowingdata.json",
        dataType: "json",
        success: function (response) {
            myNetwork("#vis", response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus);
        }
    });

}

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

function createBarchart(data, whereToRender, title, dataPointSuffix, plotType) {
    var barChart = new Highcharts.Chart(
        {
            exporting: {
                enabled: false
            },
            chart: {
                renderTo: whereToRender,
                type: plotType,
                backgroundColor: null
            },
            title: {
                text: title
            },
            subtitle: {
                text: ""
            },
            legend: {
                enabled:false
            },
            xAxis: {
                categories: data.catData,
                title: {
                    text: null
                },
                gridLineWidth: 0.0,
                /*labels: {
                    formatter: function() {
                        return "";
                    }
                },*/
                //labels: {
                //    enabled: false
                //},
                tickLength: 0,
                tickWidth: 0,
                lineWidth: 0
            },
            yAxis: {
                //min: 0,
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
                tickColor: '#000000'
                //tickInterval: 250,

                //endOnTick: false,
                //max: 1000
            },

            plotOptions: {
                bar: {
                    groupPadding: 0,
                    pointPadding: 0,
                    /*
                    dataLabels: {

                        enabled: true,
                        formatter: function() {
                            return this.point.name;
                        }
                    },*/
                    borderWidth: 7,
                    animation: false
                }
            },

            tooltip: {
                pointFormat: '<b>{point.y}</b> ' + dataPointSuffix
            },

            credits: {
                enabled: false
            },
            series: [{
                color: '#fdba00',
                data: data.data
            }]
        }
    );

    return barChart;
}

function buildTmTable() {
    $('#tmModalID').on('show.bs.modal', function (event) {

        var button = $(event.relatedTarget); // Button that triggered the modal
        var filename = "data/tm/" + button.attr('id') + ".json";
        var modal = $(this);
        modal.find('.modal-title').html("");
        modal.find('.modal-body').html("");
        modal.find('.modal-meta').html("");

        window.location.hash = "tmmodal";
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
                var id = button.attr('id');
                modal.find('.modal-title').html(response.name);

                var html = '<div id="' + id + 'songsyear"></div>';
                //html += '<div style="text-align: center; font-family: "League Spartan">'
                //html += '<text class="highcharts-title" text-anchor="middle"><tspan>Top 5 framgångsrika mellolåtar</tspan></text>';
                html += "<h4 class='text-center' style='margin-top: 2em;'>Top 5 framgångsrika mellolåtar</h4>";
                html += '<ol class="small">'
                for (var i=0; i<response.sucessfull_songs.length; ++i) {
                    html += '<li>' + response.sucessfull_songs[i] + '</li>'
                }
                html += '</ol>';
                //html += '</div>'
                modal.find('.modal-body').html(html);


                var songsPerYearData = [];
                var catData = []
                for (var i=0; i<response.songs_per_year.length; ++i){
                    catData.push(response.songs_per_year[i].year);
                    songsPerYearData.push({
                        name: response.songs_per_year[i].year,
                        y: response.songs_per_year[i].number_songs
                    });
                }
                data = {catData: catData, data: songsPerYearData};
                $("#tmModalID div.modal-body").css("visibility", "hidden");
                var chart = createBarchart(data, id + "songsyear", "Antal låtar per år mellan 2002-2014", "låtar", "bar");

                modal.on("shown.bs.modal", function( event ){
                    chart.reflow();
                    $("#tmModalID div.modal-body").css("visibility", "visible");
                });




                return false;
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("Error!" + textStatus   );
                return true;
            }
        });
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
                    var link = '<a class="yellow" href="" data-toggle="modal" data-target="#tmModalID" ';
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
                    var v = '' + antal + '<span class="hidden-xs"> (' + row[4].toFixed(0) + '%)</span>';
                    return v;
                },
                sType: "num-html"
            },
            {
                sClass: "count",
                aTargets: [3],
                bSortable: true,
                aDataSort: [3],
                searchable: true,
                sTitle: "Antal vinnande låtar",
                "mRender": function (a, type, row) {
                    var v = '' + a + '<span class="hidden-xs"> (' + row[5].toFixed(0) + '%)</span>';
                    return v;
                },
                sType: "num-html"
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
            buildTmArtistsPiechart(response, 'tmArtistsPieChart', 'Artisterna', 'Fördelning av låtar efter kön på artisten/artisterna');
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
            buildTmArtistsPiechart(response, 'tmTmPieChart', 'Låtskrivarna', 'Fördelning av låtar efter kön på låtskrivaren/låtskrivarna');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus);
        }
    });

    buildTmTable();
    buildNetwork();
}


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
                stacking: 'percent',
                events: {
                    legendItemClick: function () {
                        return false;
                    }
                }
            }
        },
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        },

        title: {
            text: 'Antal låtar skrivna av enbart kvinnor, i blandad grupp och enbart män 2002-2014',
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
            headerFormat: '<span class="leaguespartansmall">{point.x}</span><br>',
            pointFormat: '<span style="color: {series.color};">●</span> {series.name}: {point.y:.0f}%<br>',
            shared: true,
            useHTML: true
        },
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
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
                name: 'Blandad',
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


