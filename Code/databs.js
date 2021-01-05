/* <!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="https://www.gstatic.com/firebasejs/8.1.1/firebase-app.js"></script>
 */

// Our item-price-db firebase's config
var firebaseConfig = {
    apiKey: "AIzaSyBygCJ77yGqjuqSHHsySgmAAOX-SHInd5U",
    authDomain: "item-price-db.firebaseapp.com",
    databaseURL: "https://item-price-db.firebaseio.com",
    projectId: "item-price-db",
    storageBucket: "item-price-db.appspot.com",
    messagingSenderId: "308733793283",
    appId: "1:308733793283:web:115bd9d2ef3c83ffa8aa36",
    measurementId: "G-27FWLJC6HP"
};

//declaring variables
var values, keys, index = 0, r = [];

// Initialize Firebase
var dbfb = firebase.initializeApp(firebaseConfig, "dbfb");  // database firebase
var database = dbfb.database();
var ref = database.ref("/"); // item-price-db


// set data to the firebase
function setData(id, dt){
	ref.child(id).set(dt);
		
}

function getData(){
	// get data
	ref.on('value', gotData, errData); 

	// getting random data
	// Function to generate random number 
	function randomNumber(min, max, range) {  // both min and max inclusive
		var arr = [];
		var rand = 0;
		for (var i=0; i<range; i++){
			rand = Math.floor(Math.random() * (max - min + 1)) + min;
			// append new value to the array
			arr.push(rand);
		}
		// return the array of random numbers in given range
		return arr;
	} 
	
	
	function gotData(data){
	  // extracting required data from the received dataset
		values = data.val();
		keys = Object.keys(values);
	  	r = randomNumber(0, keys.length-1, 5); // 5 is the number of items needed
	}
}

function display_question(final_score) // here final score is the final score after every que
{
	if(index == 5)  // 5 questions max  
	{
		// after attempting all questions, displaying results
		$("#question_text").html("GAME OVER!! \n Scroll down to see your score statistics.");
		hideImg();
		$('label[for="item_price"], input#item_price, button#price_submit').hide();
		// display the graph of points gained by the user
		display_graph();
		UpdateScore(final_score);  // here as index==5, final score is the final score after all que
		$("#new_game").css('visibility', 'visible');
		$("#new_game").html('Retry');
		$("#new_game").click(function(){
			window.location = "./home.html";
		});
	}
	else
	{
		// displaying the question
		$("#question_text").html("Q" + (index + 1) + ". " + values[r[index]].Name);
		unhideImg();
	  	$("#img_container").attr('src', values[r[index]].URL);
	  	index ++;	
	}	
}

// to get the item's actual price form database
function get_db_price()
{
	return values[r[index - 1]].Price;
}
  
// to hide image on error
function hideImg() {
	document.getElementById("img_container").style.display = "none";
}
// to unhide image
function unhideImg(){
	document.getElementById("img_container").style.display = "inline";
}

// function for error 
function errData(err){
	console.log("Error !!");
	console.log(err);
}