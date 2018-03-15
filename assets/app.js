


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDPwIisQLGUCIzJ7ol1cFYXgzxUYlTxyy0",
    authDomain: "howtotraintrain-e0e68.firebaseapp.com",
    databaseURL: "https://howtotraintrain-e0e68.firebaseio.com",
    projectId: "howtotraintrain-e0e68",
    storageBucket: "",
    messagingSenderId: "692255636536"
  };
  firebase.initializeApp(config);



// Initial Values

var database = firebase.database();
var trainName = "";
var destination = "";
var frequencyTime = $("frequency").val();
var firstTrainTime = "";
var mintuesAway = "";
var trainKeys = {};
// var randomDate = "02/23/1999";
var randomFormat = "MM/DD/YY";
var convertedDate = moment(frequencyTime, randomFormat);

function calculateArrival(tFrequency, firstTime) {
  // var tFrequency = 3;

  // Time is 3:30 AM
  // var firstTime = "03:30";

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  // console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  // console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % tFrequency;
  // console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = tFrequency - tRemainder;
  // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  return [tMinutesTillTrain, moment(nextTrain).format("hh:mm")];
  // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
}

function myFunction() {
  setInterval(function(){ 

   }, 1000);
}

$("#add-employee-btn").on("click", function () {
  // Don't refresh the page!
  event.preventDefault();
  
  console.log("you clicked");
  trainName = $("#train-name").val().trim();
  destination = $("#destination").val().trim();
  frequencyTime = $("#frequency").val().trim();
  firstTrainTime = $("#first-train").val().trim();
  $('#train-form')[0].reset();

  database.ref().push({
    trainName: trainName,
    destination: destination,
    frequencyTime: frequencyTime,
    firstTrainTime: firstTrainTime
  });
    
});

database.ref().on("child_added", function(childSnapshot) {
  $("tbody").append("<tr><th>" + childSnapshot.val().trainName +
"<td>" + childSnapshot.val().destination + "</td>" +
"<td>" + childSnapshot.val().frequencyTime + "</td>" +
"<td id=" + childSnapshot.key + "-nextArrival>"  + "</td>" +
"<td id=" + childSnapshot.key + "-minutesAway>"  + "</td>");

trainKeys[childSnapshot.key] = [childSnapshot.val().firstTrainTime, childSnapshot.val().frequencyTime];
console.log(trainKeys);

});

function updateTime() {
  for (var key in trainKeys) {
    var firstTrainTime = trainKeys[key][0];
    var frequencyTime = trainKeys[key][1];
    var returnValue = calculateArrival(frequencyTime, firstTrainTime);
    var minThisTrain = returnValue[0];
    var arrivalThisTrain = returnValue[1];
    $("#"+key+"-nextArrival").html(arrivalThisTrain);
    $("#"+key+"-minutesAway").html(minThisTrain);
  }
}

setInterval(updateTime, 1000);

// database.ref().orderByChild("trainName").limitToLast(1).on("child_added", function(snapshot) {

//   var sv = snapshot.val();

//   console.log(sv.trainName, sv.destination, sv.frequencyTime, sv.firstTrainTime);


//   $("#train-name").text(sv.trainName);
// $("#destination").text(sv.destination);
// $("#frequency").text(sv.frequencyTime);
// $("#first-train").text(sv.firstTrainTime);

// });

