$(document).ready(function(){
    $('#chooseHandle .radio input').click( function(){
        $("#add_btn").removeClass("disabled");
    });

    $("#add_btn").click( function(){
        $handle = $('input[name="optradio"]:checked', '#chooseHandle').attr("id");
        $.post("/data/" + $handle, function(data, status){
            if(status == "success"){
                alert("Tweets indexed successfully!");
            }
        });
    });
});