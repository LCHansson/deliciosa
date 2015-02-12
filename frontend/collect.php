<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="ISO-8859-1">
    <title>Collect</title>
    <script src="jquery-1.11.2.min.js"></script>
    <script>

        function addOSM(jsonStr){
            $("#" + window.target).html(jsonStr);
            var remove = $("<button type='button'>Remove OSM</button>");
            remove.on("click", function(){
                $(this).closest("p").find("textarea").html("");
                $(this).closest("label").html("No OSM result selected.");
            });
            $("#" + window.target + "_id").html( JSON.parse(jsonStr).display_name ).append(remove);
        }

        function processOSM( json ){
            for (var i = 0; i < json.length; i++){
                var place = json[i];
                var tag = $("<a>");
                tag.attr("data-json", JSON.stringify(place));
                tag.attr("href", "#");
                tag.html( place.display_name );
                tag.on("click", function(){

                    addOSM($(this).attr("data-json"));
                });
                $("#osm").append( $("<p>").html("Use this: ").append(tag) );
            }
        }



        function getOSM( id, target ){
            window.target = target;
            $("#osm").html("");
            var query = $( "#" + id ).val();
            var url = "http://nominatim.openstreetmap.org/?format=json&q=" + encodeURIComponent(query) + "&json_callback=processOSM&callback=";
            console.log(url);
            $.getJSON(url, function(){
                console.log("success");
            }).complete(function(response){
                if (response.status == 200){
                    eval(response.responseText);
                } else {
                    console.log("Error");
                    console.log(response);
                }
            });


        }

        $(function () {
            var osm = $("#birth_osm").html();
            window.target = "birth_osm"
            addOSM(osm);
            var osm = $("#res_osm").html();
            window.target = "res_osm"
            addOSM(osm);
        });
    </script>
</head>
<body>


<form action="collect.php" method="post">


<?php

$link = mysql_connect('localhost', 'perriard_mk', 'hundrafår');

mysql_select_db("perriard_mellokollen");



if ($_POST["submit"] == "submit" ){
    $band = $_POST["band"] == "on" ? 1 : 0;
    $sql = "UPDATE artists SET birthplace = '".addslashes($_POST["birthplace"])."', birth_osm = '".addslashes($_POST["birth_osm"])."', residence = '".addslashes($_POST["residence"])."', res_osm = '".addslashes($_POST["res_osm"])."', birthyear = '".addslashes($_POST["birthyear"])."', band = '".$band."' WHERE id = '".addslashes($_POST["id"])."';";
    $result = mysql_query($sql);
    if($result){
        echo "<p style='background-color: orangered'>Record saved.</p>";
    } else {
        die('Error: ' . mysql_error());
    };
}



$result = mysql_query("SELECT * FROM artists WHERE birthplace = '' OR residence = '' OR birthyear = '' ORDER BY id DESC LIMIT 1");


if (!$result) {
    die('Ungültige Anfrage: ' . mysql_error());
}

if (mysql_num_rows($result) != 0) {



    while ($row = mysql_fetch_assoc($result)) {
        echo "<p>ID: ".$row["id"]."</p>";
        echo "<input name='id' type='text' hidden=hidden value='".$row["id"]."'>";
        echo "<p>Artist/band name: ".$row["artist"]."</p>";
        if ($row["artist_wikilink"] != "") {
            echo "<p><a href='http://".$row["artist_wikilink"]."' target='_blank'>".$row["artist_wikilink"]."</a></p>";
        } else {
            echo "<p>No link to wikipedia.</p>";
        }
        $array = split(" ", $row["artist"]);
        if (count($array) > 1) {
            $f = $array[0];
            $l = join(" ", array_slice($array, 1));
            echo "<p><a href='http://www.birthday.se/sok/?f=".$f."&l=".$l."' target='_blank'>Link to birthday.se</a></p>";
        }


        ?>
        <p>If there is missing data, insert a "-" in all text fields, otherwise you will not get to the next artist.</p>
        <p>If it is a band, insert the information about the band leader / first best band member.</p>
        <p>
            <label for="birthplace">Birthplace alt. where grown up:</label>
            <input type="text" id="birthplace" name="birthplace" value="<?php echo stripslashes($row["birthplace"]); ?>">
            <button type="button" onclick="javascript:getOSM('birthplace', 'birth_osm')">Get OSM</button>
        </p>
        <p>
            <?php
            $birth_osm = stripslashes($row["birth_osm"]);
            ?>
            <label for="birth_osm" id="birth_osm_id">No OSM result selected.</label>
            <textarea type="text" id="birth_osm" name="birth_osm" hidden="hidden"><?php echo $birth_osm; ?></textarea>
        </p>

        <p>
            <label for="residence">Residence: </label>
            <input type="text" id="residence" name="residence" value="<?php echo stripslashes($row["residence"]); ?>">
            <button type="button" onclick="javascript:getOSM('residence', 'res_osm')">Get OSM</button>
        </p>

        <p>
            <?php
            $res_osm = stripslashes($row["res_osm"]);
            ?>
            <label for="res_osm" id="res_osm_id">No OSM result selected.</label>
            <textarea type="text" id="res_osm" name="res_osm" hidden="hidden"><?php echo $res_osm; ?></textarea>
        </p>

        <p>
            <label for="birthyear">Birthyear / founding year of band: </label>
            <input type="text" name="birthyear" value="<?php echo $row["birthyear"]; ?>">
        </p>

        <p>
            <label for="band">Is it a band?: </label>
            <input type="checkbox" name="band" <?php echo $row["band"] == 1 ? "checked=checked": ""; ?>>
        </p>

    <?php


    }
}

mysql_free_result($result);
?>

<button name="submit" value="submit" type="submit">Save</button>
</form>

<div id="osm"></div>

</body>
</html>
