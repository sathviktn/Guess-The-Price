// declaring variables
var user_score = [], ind = 0;

$(document).ready(function(){
    
    $('#add_item_button').css('visibility', 'hidden');
    $("#full_question").css('visibility', 'hidden');

    $("#new_game").click(function()
    {
        $("#full_question").css('visibility', 'visible');
        $("#total_points").html("Points - 0");
        getData();  // to fetch data from firebase
        
        $("#new_game").css('visibility', 'hidden');
        setTimeout(() => {
        display_question();    
        }, 5000); // displaying the questions after 5 sec
    });

    $("#price_submit").click(function()
    {
        user_price = $("#item_price").val();

        //compare guessed price with actual price
        price_from_db = get_db_price();
        price_from_db = parseInt(price_from_db.substring(1, price_from_db.length));

        //calculate score
        var new_points = calculate_score(user_price, price_from_db);

        //display correct price
        $("#correct_price").html("Correct price of the previous item: $" + price_from_db);
        $("#add_points").html("Points earned = " + new_points);

        //update score
        var final_score = update_score(new_points);
        
        // dislay question
        display_question(final_score);
    });

    function update_score(add_points)
    {
        var points_str = $("#total_points").text();
        var points_spl = points_str.split(" - ");
        var new_points = parseInt(points_spl[1]) + parseInt(add_points);  // this is the final score after every que

        // displaying total points
        $("#total_points").html("Points - " + new_points);

        user_score[ind ++] = parseInt(add_points);
        return new_points;  // returning the total score after every attempt
    }

    function calculate_score(user_price, price_from_db)
    {
        var dif = (user_price * 100) / price_from_db;
        var score = 0;

        // logic for calculating score
        if(dif == 100)
            score = 10;
        else
        {
            if(dif > 100)
                dif = dif - 100;

            else if(dif < 100)
                dif = 100 - dif;

            score = 10 - (0.1 * dif);
        }
        if (score < 0){
            score = 0;
        }
        return score.toFixed(2);
    }

    $("#add_item").click(function()
    {
        // form for adding new item
        $('<form method="POST">' + 
        '<label for="item_id">Enter Item ID: </label>' +
        '<input type="text" required name="item_id" id="new_item_id"/>' +
        '<br>' + '<br>' +

        '<label for="item_name">Enter Item name: </label>' +
        '<input type="text" required name="item_name" id="new_item_name"/>' +
        '<br>' + '<br>' +
  
        '<label for="item_url">Enter Item image url: </label>' +
        '<input type="text" required name="item_url" id="new_item_url"/>' +
        '<br>' + '<br>' +
  
        '<label for="item_price">Enter Item price: </label>' +
        '<input type="text" required name="item_price" id="new_item_price"/>' +
        '<br>' + '<br>' +
  
        '</form>').appendTo("#item_form"); 
        $('#add_item_button').css('visibility', 'visible');
    });

    $("#add_item_button").click(function()
    {
        var item_id = $("#new_item_id").val();
        var item_name = $("#new_item_name").val();
        var item_url = $("#new_item_url").val();
        var item_price = $("#new_item_price").val();
        
        var item_obj = {
            "ID" : item_id,
            "Name" : item_name,
            "URL" : item_url,
            "Price" : item_price
        };

        // to update the database with new item
        setData(item_id, item_obj);

        setTimeout(function(){ $("#new_item_id").val(""); $("#new_item_name").val(""); $("#new_item_url").val("");
        $("#new_item_price").val(""); }, 3000);
    });
      
});

// to display scores graph
function display_graph()
{
    var graph_data = new Array();
    for(var j = 0; j < user_score.length; j ++)
    {
        graph_data[j] = {y: user_score[j], label: "Q" + (j + 1)};
    }

    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        title:{
            text: "Score earned for each question"
        },
        axisY: {
            title: "Points"
        },
        data: [{        
            type: "column",  
            showInLegend: true, 
            legendMarkerColor: "grey",
            legendText: "Question Number",
            dataPoints: graph_data
        }]
    });
    chart.render();
}