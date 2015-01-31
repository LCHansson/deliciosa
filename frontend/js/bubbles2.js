/**
 * Created by love on 29/01/15.
 */
function calculateOffset(maxR) {
    return function(d) {
        neighbours = findNeighbours(quadroot,
            xScale(d.year),
            rScale(d.r),
            maxR);
        var n=neighbours.length;
        //console.log(j + " neighbours");
        var upperEnd = 0, lowerEnd = 0;

        if (n){
            //for every circle in the neighbour array
            // calculate how much farther above
            //or below this one has to be to not overlap;
            //keep track of the max values
            var j=n, occupied=new Array(n);
            while (j--) {
                var p = neighbours[j];
                var hypoteneuse = rScale(d.r)+rScale(p.r)+padding;
                //length of line between center points, if only
                // "padding" space in between circles

                var base = xScale(d.x) - xScale(p.x);
                // horizontal offset between centres

                var vertical = Math.sqrt(Math.pow(hypoteneuse,2) -
                Math.pow(base, 2));
                //Pythagorean theorem

                occupied[j]=[p.offset+vertical,
                    p.offset-vertical];
                //max and min of the zone occupied
                //by this circle at x=xScale(d.x)
            }
            occupied = occupied.sort(
                function(a,b){
                    return a[0] - b[0];
                });
            //sort by the max value of the occupied block
            //console.log(occupied);
            lowerEnd = upperEnd = 1/0;//infinity

            j=n;
            while (j--){
                //working from the end of the "occupied" array,
                //i.e. the circle with highest positive blocking
                //value:

                if (lowerEnd > occupied[j][0]) {
                    //then there is space beyond this neighbour
                    //inside of all previous compared neighbours
                    upperEnd = Math.min(lowerEnd,
                        occupied[j][0]);
                    lowerEnd = occupied[j][1];
                }
                else {
                    lowerEnd = Math.min(lowerEnd,
                        occupied[j][1]);
                }
                //console.log("at " + formatPercent(d.x) + ": "
                //          + upperEnd + "," + lowerEnd);
            }
        }

        //assign this circle the offset that is smaller
        //in magnitude:
        return d.offset =
            (Math.abs(upperEnd)<Math.abs(lowerEnd))?
                upperEnd : lowerEnd;
    };
}

function songBrowser(data) {

    console.log(data);

    var w = 800;
    var h = 330;
    var r = 20;
    margin = r;

//Set up SVG and axis//
    var songbrowser = d3.select("#songBrowser");




    d3.selectAll("#songbrowsersvg")
        .attr("width", w + "px")
        .attr("height", h + "px")
        .append("g") // append the average line
        .attr("id", "x-axis") //
        .attr("transform", "translate(0,177)")
        .append("line")
        .attr("x1", "0")
        .attr("x2", w.toString())
        .style("stroke", "black");

    //d3.select("svg")
    //    .append("g") // append the average line
    //    .attr("id", "shakespeare") //
    //    .attr("transform", "translate(604,140)")
    //    .append("line")
    //    .attr("y1", "-80")
    //    .attr("y2", "33");

    //d3.select("svg")
    //    .append("g") // append the average line
    //    .attr("id", "moby") //
    //    .attr("transform", "translate(834,140)")
    //    .append("line")
    //    .attr("y1", "-80")
    //    .attr("y2", "33");


    songbrowser.selectAll("div")
        .data(data)
        .enter()
        .append("div")
        .attr("class", function (d) {
            return "song-circle blue";
        })
        .style("position", "absolute")
        .style("width", r + "px")
        .style("height", r + "px")

        //.style("background-image", function (d) {
        //    return "url(" + d.id + ".png)";
        //})
        .style("left", function (d) {
            return (parseInt(d.year) - 2002) * ((w - 2 * margin)/12) + margin + "px";
        })
        .style("top", function (d) {
            return (201 - parseInt(d.sent_score)) + "px";
        })
        .attr("id", function (d) {
            return d.id;
        })
        .on("mouseover", function (d) {
            var xPosition = parseFloat(d3.select(this).style("left"));
            var yPosition = parseFloat(d3.select(this).style("top"));
            //Update the tooltip position and value
            d3.select("#tooltip")
                .style("left", xPosition + "px")
                .style("top", yPosition - 177 + "px")
                .select("#value")
                .text(d.sent_score);
            d3.select("#tooltip")
                .select("#songhead")
                .text(d.id + ":");
            //d3.select("#puff-daddy")
            //    .classed("default", false);
            //Show the tooltip

            d3.select("#tooltip").classed("hidden", false);
        })

        .on("mouseout", function () {
            //Hide the tooltip
            d3.select("#tooltip").classed("hidden", true);
        })





//end of the initial data thing
    ;

    //d3.select(".regionselect")
    //    .on("click", function (d) {
    //
    //        d3.select("#regionlegend")
    //            .classed("hidden", false);
    //        d3.selectAll(".south")
    //            .classed("southern", true)
    //            .classed("rapper-circle", false);
    //        d3.selectAll(".east")
    //            .classed("eastern", true)
    //            .classed("rapper-circle", false);
    //        d3.selectAll(".midwest")
    //            .classed("midwestern", true)
    //            .classed("rapper-circle", false);
    //        d3.selectAll(".west")
    //            .classed("western", true)
    //            .classed("rapper-circle", false);
    //        d3.selectAll(".wutang")
    //            .classed('wutangfill', false);
    //        d3.selectAll(".nowutang")
    //            .classed("nowutangfill", false);
    //        d3.select("#active")
    //            .classed("active", false);
    //    });

    //d3.select(".wutangselect")
    //    .on("click", function (d) {
    //        d3.select("#regionlegend")
    //            .classed("hidden", true);
    //        d3.selectAll(".wutang")
    //            .classed('wutangfill', true);
    //        d3.selectAll(".nowutang")
    //            .classed("nowutangfill", true);
    //        d3.select("#active")
    //            .classed("active", false);
    //        d3.selectAll(".south")
    //            .classed("southern", false)
    //            .classed("rapper-circle", true);
    //        d3.selectAll(".east")
    //            .classed("eastern", false)
    //            .classed("rapper-circle", true);
    //        d3.selectAll(".midwest")
    //            .classed("midwestern", false)
    //            .classed("rapper-circle", true);
    //        d3.selectAll(".west")
    //            .classed("western", false)
    //            .classed("rapper-circle", true);
    //    });

    //d3.select(".allartists")
    //    .on("click", function (d) {
    //        d3.selectAll(".south")
    //            .classed("southern", false)
    //            .classed("rapper-circle", true);
    //        d3.selectAll(".east")
    //            .classed("eastern", false)
    //            .classed("rapper-circle", true);
    //        d3.selectAll(".midwest")
    //            .classed("midwestern", false)
    //            .classed("rapper-circle", true);
    //        d3.selectAll(".west")
    //            .classed("western", false)
    //            .classed("rapper-circle", true);
    //        d3.select("#regionlegend")
    //            .classed("hidden", true);
    //        d3.selectAll(".wutang")
    //            .classed('wutangfill', false);
    //        d3.selectAll(".nowutang")
    //            .classed("nowutangfill", false);
    //    });


}

function makeSongBrowser() {

    $.ajax({
        type: "POST",
        url: "./data/texterna_allcounts.json",
        dataType: "json",
        success: function (response) {
            songBrowser(response.data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error!" + textStatus);
        }
    });
}