// for login-register animation
var x = document.getElementById("login");
var y = document.getElementById("register");
var z = document.getElementById("btn");

function register()
{
	x.style.left = "-400px";
	y.style.left = "50px";
	z.style.left = "110px";
}

function login()
	{
	x.style.left = "50px";
	y.style.left = "450px";
	z.style.left = "0px";
}

// Our user-details firebase's config
var userdbfirebaseConfig = {
    apiKey: "AIzaSyByV6hF-gbWlqTss3F7VZ4niQtPsUtYxiU",
    authDomain: "user-details-cbbff.firebaseapp.com",
    databaseURL: "https://user-details-cbbff-default-rtdb.firebaseio.com",
    projectId: "user-details-cbbff",
    storageBucket: "user-details-cbbff.appspot.com",
    messagingSenderId: "1070286381051",
    appId: "1:1070286381051:web:a54233c82f6a4de5c5755e",
	measurementId: "G-6RN1H3QK0S"
};

// Initialize Firebase
// user-details database firebase
var userdbfb = firebase.initializeApp(userdbfirebaseConfig, "userdbfb");  
// database
var userdb = userdbfb.database();  
// database reference
var refr = userdb.ref("/"); // user-db
// authentication
var authn = userdbfb.auth();

// to register new user
function setUser(){

	// new data input from the page
	var username = document.getElementById("newusername").value;
	var email = document.getElementById("newemail").value;
	var passwd = document.getElementById("newpass").value;
	
	if (document.getElementById("check").checked){   // check if user agrees with the T&C
		// creating user in firebase
		authn.createUserWithEmailAndPassword(email, passwd).then((user) => {
			// Registered successfully
			var user = authn.currentUser;  // userdbfb.auth().currentUser
			// to add the user to the database
    		regUser(user);
		}) 
		.catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			alert(errorCode + errorMessage);
			console.log(errorCode + errorMessage);
		});

		function regUser(user) 
		{
			// user data
    		var dt = {
			  UserName : username, 
			  Email : email,
			  Password : passwd,
			  Score : 0
			};
			refr.child(username).set(dt); // using username for child name
		}
		setTimeout(function(){ window.location.reload(); }, 5000); // after 5 sec, reload page
	}
}

function logUser(){
	// get data
	var email = document.getElementById("email").value;
	var passwd = document.getElementById("password").value;

	authn.setPersistence("session").then(function() {  // userdbfb.auth.Auth.Persistence.SESSION
		return authn.signInWithEmailAndPassword(email, passwd).then((user) => {
	  	if (user) {
			// User is signed in.
			// now got to home page
			window.location = "./home.html";
		} 
		else {
	    // No user is signed in.
	  }
	});
	})
	.catch((error) => {
		var errorCode = error.code;
		var errorMessage = error.message;
		alert(errorCode + errorMessage);
		console.log(errorCode + errorMessage);
	});
}

// updating user's score back to firebase
function UpdateScore(final_score){
	// fetching current player auth details
	var player = authn.currentUser;
	// getting user data from firebase
	refr.on('value', fetchData, errorData); 
	
	function fetchData(data){
	    // extracting required data from the received dataset
		// getting all user's details
		var user_details = data.val();
		// getting values of every user.... not the keys
		var values = Object.values(user_details);

		// finding the current user by searching for every user
		values.forEach(user => {
			// check if the user is the current player or not
			if(user.Email == player.email){  
				if (user.Score < final_score ) {
					refr.child(user.UserName).update({    
						Score : final_score
					});
				}
			}
		});
	}

	// function for error 
	function errorData(err){
		console.log("Error !!");
		console.log(err);
	}
}

// to log-out the current logged-in user
function logout(){
	authn.signOut().then(function() {
	  // Sign-out successful.
	  alert("Signed-out successfully");
	})
	.catch(function(error) {
		alert(error);
		console.log(error);
	});
	// after logout, redirecting to the thank you page
	window.location ="./thankyou.html";
}
