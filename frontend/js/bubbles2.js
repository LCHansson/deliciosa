/**
 * Created by love on 29/01/15.
 */

function songBrowser(data) {

    console.log(data);

    var w = 800;
    var h = 600;
    var r = 25;

//Set up SVG and axis//
    var svg = d3.select("#songBrowser")
        ;
    d3.select("svg")
        .append("g") // append the average line
        .attr("id", "x-axis") //
        .attr("transform", "translate(0,50)")
        .append("line")
        .attr("x1", "0")
        .attr("x2", w);

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


    svg.selectAll("div")
        .data(data)
        .enter()
        .append("div")
        .attr("class", function (d) {
            return "song-circle ";
        })
        .style("position", "absolute")
        .style("width", r + "px")
        .style("height", r + "px")

        //.style("background-image", function (d) {
        //    return "url(" + d.id + ".png)";
        //})
        .style("left", function (d) {
            return (parseInt(d.year) - 2002) * (w/13) + "px";
        })
        .style("top", function (d) {
            return (201 - parseInt(d.sent_score)) + "px";
        })
        .attr("id", function (d) {
            return d.id;
        })
        //.on("mouseover", function (d) {
        //    var xPosition = parseFloat(d3.select(this).style("left"));
        //    var yPosition = parseFloat(d3.select(this).style("top"));
        //    //Update the tooltip position and value
        //    d3.select("#tooltip")
        //        .style("left", xPosition + "px")
        //        .style("top", yPosition + "px")
        //        .select("#value")
        //        .text(d.words);
        //    d3.select("#tooltip")
        //        .select("#rapper")
        //        .text(d.rapper + ":");
        //    d3.select("#puff-daddy")
        //        .classed("default", false);
        //    //Show the tooltip
        //
        //    d3.select("#tooltip").classed("hidden", false);
        //})
        //
        //.on("mouseout", function () {
        //    //Hide the tooltip
        //    d3.select("#tooltip").classed("hidden", true);
        //})





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