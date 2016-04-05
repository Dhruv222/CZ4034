$("#results").hide();
$("#page_numbers").hide();

$(document).ready(function(){

    $page = 0;
    $sentiment_query = "mixed";
    $location = "worldwide";
    $months = ["January", "February", "March", "April", "May", "June","July","August","September","October","November","December"];

    $(".previous").hide();
    $(".next").hide();

    $("#worldwide").attr("checked", true);
    $("#mixed").attr("checked", true);

    $("#search_btn").click(function(){
        $t1 = $.now();
        $sentiment_query = $('#form1 input[name="optradio"]:checked').attr("id");
        $location = $('#form2 input[name="optradio"]:checked').attr("id");
        $page = 0;
        $("#main").empty();
        $page++;
        $query = $("#search_box").val();
        $i = 0;
        if ($sentiment_query == "mixed"){
          $sentiment_query = "*";
        }
        if ($location == "local"){
          $location = 1;
        }
        else if ($location == "worldwide"){
          $location=0;
        }
        $.get("/search", {q: $query, sentiment: $sentiment_query, location: $location}, function(data, status){
            if(status == "success"){
                $t2 = $.now();
                console.log(status);
            }
            $result = JSON.parse(data);
            $("#num_results").html($result.response.numFound);
            $("#time").html(($t2 - $t1)/1000);
            $("#results").show();
            $("#page_numbers").show();
            console.log($result);
            for($i = 0; $i < $result.response.docs.length; $i++){
                $handle = $result.response.docs[$i].twitter_handle;
                $tweet = $result.response.docs[$i].tweet_text;
                $sentiment = $result.response.docs[$i].sentiment;
                $date = new Date($result.response.docs[$i].timestamp);
                $date_format = $months[$date.getMonth()] + " " + $date.getDate() + ", " + $date.getFullYear() ;
                if ($sentiment == "positive"){
                    $color = "lightgreen";
                }
                else if ($sentiment == "neutral") {
                    $color = "lightblue";
                }
                else if ($sentiment == "negative") {
                    $color = "pink";
                }
                $newDiv = "<div style='background-color:"+ $color + "' class='row'>" +
                    "<div class='col-md-7'>" + "<h3>@"+$handle+"</h3>" + "<h4>" + $date_format +"</h4>" +
                    "<p id='p1'>" + $tweet + "</p>" +
                    "</div></div> <hr/>";
                console.log($newDiv);
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
        $.get("/search", {q: $query, page: $page, q: $query, sentiment: $sentiment_query, location: $location}, function(data, status){

            $result = JSON.parse(data);
            $("#p_no").html($page);
            for($i = 0; $i < $result.response.docs.length; $i++){
                $tweet = $result.response.docs[$i].tweet_text;
                $handle = $result.response.docs[$i].twitter_handle;
                $sentiment = $result.response.docs[$i].sentiment;
                $date = new Date($result.response.docs[$i].timestamp);
                $date_format = $months[$date.getMonth()] + " " + $date.getDate() + ", " + $date.getFullYear() ;
                if ($sentiment == "positive"){
                    $color = "lightgreen";
                }
                else if ($sentiment == "neutral") {
                    $color = "lightblue";
                }
                else if ($sentiment == "negative") {
                    $color = "pink";
                }
                $newDiv = "<div style='background-color:"+ $color + "' class='row'>" +
                    "<div class='col-md-7'>" + "<h3>@" + $handle + "</h3>" + "<h4>"+ $date_format +"</h4>" +
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

        $.get("/search", {q: $query, page: $page, q: $query, sentiment: $sentiment_query, location: $location}, function(data, status){

            $result = JSON.parse(data);
            $("#p_no").html($page);
            for($i = 0; $i < $result.response.docs.length; $i++){
                $tweet = $result.response.docs[$i].tweet_text;
                $handle = $result.response.docs[$i].twitter_handle;
                $sentiment = $result.response.docs[$i].sentiment;
                $date = new Date($result.response.docs[$i].timestamp);
                $date_format = $months[$date.getMonth()] + " " + $date.getDate() + ", " + $date.getFullYear() ;
                if ($sentiment == "positive"){
                    $color = "lightgreen";
                }
                else if ($sentiment == "neutral") {
                    $color = "lightblue";
                }
                else if ($sentiment == "negative") {
                    $color = "pink";
                }
                $newDiv = "<div style='background-color:"+ $color + "' class='row'>" +
                    "<div class='col-md-7'>" + "<h3>@" + $handle + "</h3>" + "<h4>"+ $date_format +"</h4>" +
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
