/**
 * Created by love on 29/01/15.
 */


function songBrowser(data) {


    /* INIT */
    console.log(data);

    var w = 800;
    var h = 330;
    var r = 20;
    margin = r;

    /* QUAD TREE */
    //var quadtree = d3.geom.quadtree()
    //    .x(function(d) { return xScale(d.year); })
    //    .y(0) // constant, they are all on the same line
    //    .extent([[xScale(-1),0],[xScale(2),0]]);
    //// extent sets the domain for the tree
    // using the format [[minX,minY],[maxX, maxY]]
    // optional if you're adding all the data at once

    //var quadroot = quadtree([]);
    // create an empty adjacency tree;
    // the function returns the root node.

    // Find the all nodes in the tree that overlap a given circle.
    // quadroot is the root node of the tree, scaledX and scaledR
    // are the position and dimensions of the circle on screen
    // maxR is the (scaled) maximum radius of dots that have
    // already been positioned.
    // This will be most efficient if you add the circles
    // starting with the smallest.
    //function findNeighbours(root, y, r, maxR) {
    //
    //    var neighbours = [];
    //    //console.log("Neighbours of " + y + ", r" + r);
    //
    //    root.visit(function(node, x1, y1, x2, y2) {
    //        console.log("visiting (" + x1 + "," +x2+")");
    //        var p = node.point;
    //        if (p) {  //this node stores a data point value
    //            var overlap, x2=xScale(p.x), r2=rScale(p.r);
    //            if (x2 < scaledX) {
    //                //the point is to the left of x
    //                overlap = (x2+r2 + padding >= scaledX-scaledR);
    //                /*console.log("left:" + x2 + ", radius " + r2
    //                 + (overlap?" overlap": " clear"));//*/
    //            }
    //            else {
    //                //the point is to the right
    //                overlap = (scaledX + scaledR + padding >= x2-r2);
    //                /*console.log("right:" + x2 + ", radius " + r2
    //                 + (overlap?" overlap": " clear"));//*/
    //            }
    //            if (overlap) neighbours.push(p);
    //        }
    //
    //        return (x1-maxR > scaledX + scaledR + padding)
    //            && (x2+maxR < scaledX - scaledR - padding) ;
    //        //Returns true if none of the points in this
    //        //section of the tree can overlap the point being
    //        //compared; a true return value tells the `visit()` method
    //        //not to bother searching the child sections of this tree
    //    });
    //
    //    return neighbours;
    //}
    //
    //function calculateOffset(maxR) {
    //    return function(d) {
    //        neighbours = findNeighbours(quadroot,
    //            d.year,
    //            rScale(d.r),
    //            maxR);
    //        var n=neighbours.length;
    //        //console.log(j + " neighbours");
    //        var upperEnd = 0, lowerEnd = 0;
    //
    //        if (n){
    //            //for every circle in the neighbour array
    //            // calculate how much farther above
    //            //or below this one has to be to not overlap;
    //            //keep track of the max values
    //            var j=n, occupied=new Array(n);
    //            while (j--) {
    //                var p = neighbours[j];
    //                var hypoteneuse = rScale(d.r)+rScale(p.r)+padding;
    //                //length of line between center points, if only
    //                // "padding" space in between circles
    //
    //                var base = xScale(d.x) - xScale(p.x);
    //                // horizontal offset between centres
    //
    //                var vertical = Math.sqrt(Math.pow(hypoteneuse,2) -
    //                Math.pow(base, 2));
    //                //Pythagorean theorem
    //
    //                occupied[j]=[p.offset+vertical,
    //                    p.offset-vertical];
    //                //max and min of the zone occupied
    //                //by this circle at x=xScale(d.x)
    //            }
    //            occupied = occupied.sort(
    //                function(a,b){
    //                    return a[0] - b[0];
    //                });
    //            //sort by the max value of the occupied block
    //            //console.log(occupied);
    //            lowerEnd = upperEnd = 1/0;//infinity
    //
    //            j=n;
    //            while (j--){
    //                //working from the end of the "occupied" array,
    //                //i.e. the circle with highest positive blocking
    //                //value:
    //
    //                if (lowerEnd > occupied[j][0]) {
    //                    //then there is space beyond this neighbour
    //                    //inside of all previous compared neighbours
    //                    upperEnd = Math.min(lowerEnd,
    //                        occupied[j][0]);
    //                    lowerEnd = occupied[j][1];
    //                }
    //                else {
    //                    lowerEnd = Math.min(lowerEnd,
    //                        occupied[j][1]);
    //                }
    //                //console.log("at " + formatPercent(d.x) + ": "
    //                //          + upperEnd + "," + lowerEnd);
    //            }
    //        }
    //
    //        //assign this circle the offset that is smaller
    //        //in magnitude:
    //        return d.offset =
    //            (Math.abs(upperEnd)<Math.abs(lowerEnd))?
    //                upperEnd : lowerEnd;
    //    };
    //}

    /* BROWSER */
    // Set up SVG and axis
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

    // Attach data to circles and place them along the timeline
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
        .text(function(d) { return d.first_letter })
            .style("color", "#fff")
            .style("font-family", "Helvetica Neue")
            .style("text-align", "center")

        //.style("background-image", function (d) {
        //    return "url(" + d.id + ".png)";
        //})
        .style("left", function (d) {
            return parseInt(d.x) + "px";
        })
        .style("top", function (d) {
            return parseInt(d.y + 201) + "px";
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
                .text("Peppighetspoäng: " + d.sent_score);
            d3.select("#tooltip")
                .select("#songhead")
                .text(d.song_name+ ":")
            d3.select("#tooltip")
                .select("#artist")
                .text("Artist: " + d.artist);
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