$(document).ready(function(){

    $page = 0;

    $(".previous").hide();
    $(".next").hide();

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
        $.get("/imageSearch", {img_url: $query, latitude: $latitude, longitude: $longitude}, function(data, status){
            $result = data;
            for($i = 0; $i < $result.length; $i++){
                $id = $result[$i].id;
                $tweet = $result[$i].tweet_text;
                $newDiv = "<div class='row'>" +

                    "<div class='col-md-7'" + "<a href='#'>" + "<img class='img-responsive' src='/images/" + $id + ".jpg'>" +
                    "</img> </a> </div>" +
                    "<div class='col-md-5'>" + "<h3>The New York Times</h3>" + "<h4>10th March 2016</h4>" +
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
        $.get("/imageSearch", {img_url: $query, page: $page, latitude: $latitude, longitude: $longitude}, function(data, status){
            $result = JSON.parse(data);
            for($i = 0; $i < $result.response.docs.length; $i++){
                $id = $result.response.docs[$i].id;
                $handle = $result.response.docs[$i].twitter_handle;
                $tweet = $result.response.docs[$i].tweet_text;
                newDiv = "<div class='row'>" +

                    "<div class='col-md-7'" + "<a href='#'>" + "<img class='img-responsive' src='/images/" + $id + ".jpg'>" +
                    "</img> </a> </div>" +
                    "<div class='col-md-5'>" + "<h3>@" + $handle + "</h3>" + "<h4>10th March 2016</h4>" +
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
        $.get("/imageSearch", {img_url: $query, page: $page, latitude: $latitude, longitude: $longitude}, function(data, status){
            $result = JSON.parse(data);
            for($i = 0; $i < $result.response.docs.length; $i++){
                $id = $result.response.docs[$i].id;
                $tweet = $result.response.docs[$i].tweet_text;
                newDiv = "<div class='row'>" +

                    "<div class='col-md-7'" + "<a href='#'>" + "<img class='img-responsive' src='/images/" + $id + ".jpg'>" +
                    "</img> </a> </div>" +
                    "<div class='col-md-5'>" + "<h3>The New York Times</h3>" + "<h4>10th March 2016</h4>" +
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
