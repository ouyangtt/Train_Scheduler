


$(document).ready(function() {

    
 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBVn1RpsoovSwflwWNlnVMERVzHn7TyVLE",
    authDomain: "train-scheduler-25a31.firebaseapp.com",
    databaseURL: "https://train-scheduler-25a31.firebaseio.com",
    projectId: "train-scheduler-25a31",
    storageBucket: "",
    messagingSenderId: "694180461098"
  };
  firebase.initializeApp(config);

    var database = firebase.database();

    $('#submit-train').on('click', function() {

        // Grabs user input.
        var trainName = $('#train-name').val().trim();
        var destination = $('#destination-name').val().trim();
        var frequency = $('#frequency').val().trim();
        var hour = $('#first-train-time-hour');
        var minute = $('#first-train-time-minute');
        var hourValue = hour.val().trim();
        var minuteValue = minute.val().trim();
        var hourMinute = hourValue + ":" + minuteValue;
        var firstTrain = moment(hourMinute, 'HH:mm').subtract(1, 'years').unix();


        database.ref().push({
            trainName: trainName,
            destination: destination,
            frequency: frequency,
            startTime: firstTrain,
        });

        $('.new-train-input').val('');
        return false;
    });

    function trainFun() {
        var rows = $('<div>');
        for (var i = 0; i < trains.length; i++) {
            var train = trains[i];
            var row = $('<tr>');
        
            $(row).append($('<td>').text(train.trainName));
            $(row).append($('<td>').text(train.destination));
            $(row).append($('<td>').text(train.frequency));

           
            var timeDifference = moment().diff(moment.unix(train.startTime), 'minutes');
           
            var minutesAway = train.frequency - (timeDifference % train.frequency);
      
            var nextTrain = moment().add(minutesAway, 'minutes').format('HH:mm');
            
            $(row).append($('<td>').text(nextTrain));
            $(row).append($('<td>').text(minutesAway));
            rows.append(row);

        }
        $('#table-body').empty().append(rows.children());

    }
    setInterval(trainFun, 1000 * 60);

    var trains = [];

    database.ref().on('child_added', function(childSnapshot) {
            var childValue = childSnapshot.val();
            trains.push(childValue);
            trainFun();

        },

        function(errorObject) {});
    // }

});

