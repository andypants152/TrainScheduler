  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyArfz6NK8I6R2tLJ6mohHlim3W02A7dWHc",
    authDomain: "train-scheduler-7058c.firebaseapp.com",
    databaseURL: "https://train-scheduler-7058c.firebaseio.com",
    projectId: "train-scheduler-7058c",
    storageBucket: "train-scheduler-7058c.appspot.com",
    messagingSenderId: "583595781029"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  var trainRef = database.ref("/trainSchedule");

  $("#submit-train").on("click", function(e){
      e.preventDefault();

      var trainName = $("#train-name").val().trim();
      var destination = $("#destination").val().trim();
      var firstTrain = $("#first-train").val().trim();
      var frequency = $("#frequency").val().trim();

      trainRef.push({
          name: trainName,
          destination: destination,
          firstTrain: firstTrain,
          frequency: frequency
      })

      $("#train-name").val();
      $("#destination").val();
      $("firstTrain").val();
      $("frequency").val();
  })

  trainRef.on("child_added", function(snap){

    var nextTime = "TBD";

    var startTime = moment(snap.val().firstTrain, "HH:mm");
    var minutesSinceStart = moment.duration(moment().diff(startTime)).asMinutes();
    var minutesTill = snap.val().frequency - (minutesSinceStart % snap.val().frequency);
    var nextTime = moment().add(minutesTill, 'm').format("HH:mm");

    var newRow = $("<tr>");
    var nameCol = $("<td>").text(snap.val().name);
    var destinationCol = $("<td>").text(snap.val().destination);
    var frequencyCol = $("<td>").text(snap.val().frequency);
    var nextTimeCol = $("<td>").text(nextTime);
    var minutesTillCol = $("<td>").text(Math.ceil(minutesTill));

    newRow.append([nameCol, destinationCol, frequencyCol, nextTimeCol, minutesTillCol]);
    $("#currentTrains").append(newRow);

  })