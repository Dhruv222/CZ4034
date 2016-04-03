$("#results").hide();

$(document).ready(function(){

    $page = 0;
    $sentiment = "mixed";
    $location = "worldwide";

    $(".previous").hide();
    $(".next").hide();

    $("#worldwide").attr("checked", true);
    $("#mixed").attr("checked", true);

    $latitude = 0;
    $longitude = 0;

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    function showPosition(position) {
        $latitude = position.coords.latitude;
        $longitude = position.coords.longitude;
    }

    getLocation();

    $("#search_btn").click(function(){
        $t1 = $.now();
        $sentiment = $('#form1 input[name="optradio"]:checked').attr("id");
        $location = $('#form2 input[name="optradio"]:checked').attr("id");
        $page = 0;
        $("#main").empty();
        $page++;
        $query = $("#search_box").val();
        $i = 0;
        if ($sentiment == "mixed"){
          $sentiment = "*";
        }
        if ($location == "local"){
          $location = "('STcom' OR 'thenewpaper')";
        }
        else if ($location == "worldwide"){
          $location="*";
        }
        $.get("/search", {q: $query, sentiment: $sentiment, location: $location}, function(data, status){
            if(status == success){
                $t1 = $.now();
                console.log(status);
            }
            $result = JSON.parse(data);
            $("#num_results").html($result.response.docs.length);
            $("#time").html(($t2 - $t1)/1000);
            $("#results").show();
            console.log($result);
            for($i = 0; $i < $result.response.docs.length; $i++){
                $handle = $result.response.docs[$i].twitter_handle;
                $tweet = $result.response.docs[$i].tweet_text;
                $sentiment = $result.response.docs[$i].sentiment;
                if ($sentiment == "positive"){
                    $color = "yellow";
                }
                else if ($sentiment == "neutral") {
                    $color = "lightblue";
                }
                else if ($sentiment == "negative") {
                    $color = "pink";
                }
                $newDiv = "<div style='background-color:"+ $color + "' class='row'>" +
                    "<div class='col-md-7'>" + "<h3>@"+$handle+"</h3>" + "<h4>10th March 2016</h4>" +
                    "<p id='p1'>" + $tweet + "</p>" +
                    "</div></div> <hr/>";
                $("#main").append($newDiv);
            }
            if($result.response.numFound > 10)
                $(".next").show();
        }, "json");
    });

    $(".previous").click(function(){
        $("#main").empty();
        $page--;
        $query = $("#search_box").val();
        $i = 0;
        $.get("/search", {q: $query, sentiment: $sentiment, location: $location}, function(data, status){
            $result = JSON.parse(data);
            for($i = 0; $i < $result.response.docs.length; $i++){
                $tweet = $result.response.docs[$i].tweet_text;
                $handle = $result.response.docs[$i].twitter_handle;
                $sentiment = $result.response.docs[$i].sentiment[0];
                if ($sentiment == "positive"){
                    $color = "yellow";
                }
                else if ($sentiment == "neutral") {
                    $color = "lightblue";
                }
                else if ($sentiment == "negative") {
                    $color = "pink";
                }
                $newDiv = "<div style='background-color:"+ $color + "' class='row'>" +
                    "<div class='col-md-7'>" + "<h3>@" + $handle + "</h3>" + "<h4>10th March 2016</h4>" +
                    "<p id='p1'>" + $tweet + "</p>" +
                    "</div></div> <hr/>";
                $("#main").append($newDiv);
            }
            $(".next").show();
            if($result.response.start > 9)
                $(".previous").show();
            else
                $(".previous").hide();
        }, "json");
    });

    $(".next").click(function(){
        $("#main").empty();
        $page++;
        $query = $("#search_box").val();
        $i = 0;
        $.get("/search", {q: $query, sentiment: $sentiment, location: $location}, function(data, status){
            $result = JSON.parse(data);
            for($i = 0; $i < $result.response.docs.length; $i++){
                $tweet = $result.response.docs[$i].tweet_text;
                $handle = $result.response.docs[$i].twitter_handle;
                $sentiment = $result.response.docs[$i].sentiment[0];
                if ($sentiment == "positive"){
                    $color = "yellow";
                }
                else if ($sentiment == "neutral") {
                    $color = "lightblue";
                }
                else if ($sentiment == "negative") {
                    $color = "pink";
                }
                $newDiv = "<div style='background-color:"+ $color + "' class='row'>" +
                    "<div class='col-md-7'>" + "<h3>@" + $handle + "</h3>" + "<h4>10th March 2016</h4>" +
                    "<p id='p1'>" + $tweet + "</p>" +
                    "</div></div> <hr/>";
                $("#main").append($newDiv);
            }
            $(".previous").show();
            if($result.response.numFound - $result.response.start > 10)
                $(".next").show();
            else
                $(".next").hide();

        }, "json");
    });

});
