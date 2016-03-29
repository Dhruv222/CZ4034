$(document).ready(function(){

    $page = 0;

    $(".pager").hide();

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
        $("#main").empty();
        $page++;
        $query = $("#search_box").val();
        $i = 0;
        $.get("/search", {q: $query, latitude: $latitude, longitude: $longitude}, function(data, status){
            $result = JSON.parse(data);
            for($i = 0; $i < $result.response.docs.length; $i++){
                $tweet = $result.response.docs[$i].tweet_text;
                $newDiv = "<div class='row'>" +
                    "<div class='col-md-7'>" + "<h3>The New York Times</h3>" + "<h4>10th March 2016</h4>" +
                    "<p id='p1'>" + $tweet + "</p>" +
                    "</div></div> <hr/>";
                $("#main").append($newDiv);
            }
        }, "json");
        $(".pager").show();
    });

    $(".previous").click(function(){
        $("#main").empty();
        $page--;
        if($page > 0){
            $query = $("#search_box").val();
            $i = 0;
            $.get("/search", {q: $query, page: $page, latitude: $latitude, longitude: $longitude}, function(data, status){
                $result = JSON.parse(data);
                for($i = 0; $i < $result.response.docs.length; $i++){
                    $tweet = $result.response.docs[$i].tweet_text;
                    $newDiv = "<div class='row'>" +
                        "<div class='col-md-7'>" + "<h3>The New York Times</h3>" + "<h4>10th March 2016</h4>" +
                        "<p id='p1'>" + $tweet + "</p>" +
                        "</div></div> <hr/>";
                    $("#main").append($newDiv);
                }
            }, "json");
        }
    });

    $(".next").click(function(){
        $("#main").empty();
        $page++;
        if($page > 0){
            $query = $("#search_box").val();
            $i = 0;
            $.get("/search", {q: $query, page: $page, latitude: $latitude, longitude: $longitude}, function(data, status){
                $result = JSON.parse(data);
                for($i = 0; $i < $result.response.docs.length; $i++){
                    $tweet = $result.response.docs[$i].tweet_text;
                    $newDiv = "<div class='row'>" +
                        "<div class='col-md-7'>" + "<h3>The New York Times</h3>" + "<h4>10th March 2016</h4>" +
                        "<p id='p1'>" + $tweet + "</p>" +
                        "</div></div> <hr/>";
                    $("#main").append($newDiv);
                }
            }, "json");
        }
    });

});