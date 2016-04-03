$(document).ready(function(){
    $('#chooseHandle .radio input').click( function(){
        $("#add_btn").removeClass("disabled");
    });

    $("#add_btn").click( function(){
        $handle = $('input[name="optradio"]:checked', '#chooseHandle').attr("id");
        $coordinate = $('input[name="optradio"]:checked', '#chooseHandle').attr("coordinate");
        $.post("/data/" + $handle +"/"+ $coordinate, function(data, status){
            if(status == "success"){
                alert("Tweets indexed successfully!");
            }
        });
    });
});
