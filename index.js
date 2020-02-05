const express = require('express');
const path = require('path');
const request = require('request');
const mysql = require('mysql');
var bodyParser = require('body-parser');
const firebase = require('firebase');
var schedule = require('node-schedule');


const app = express();
var router = express.Router();
const port = process.env.PORT || 3000;

//set up Twilio for SMS notifications
// const accountSid = '';
// const authToken = '';
// const client = require('twilio')(accountSid, authToken);

// //send SMS notification
// client.messages
//   .create({
//      body: 'testestest',
//      from: '+12029316022',
//      to: '+12896858297'
//    })
//   .then(message => console.log(message.sid));

//set up Cloud Firestore database
firebase.initializeApp({
  apiKey: "AIzaSyBLUAK-EV7LgZNE27YIhe8V9O6vuK8G2T0",
  authDomain: "plantsapp-54cec.firebaseapp.com",
  databaseURL: "https://plantsapp-54cec.firebaseio.com",
  projectId: "plantsapp-54cec"
});
var db = firebase.firestore();

//create the express app
app.use(express.static("dist/angularapp"));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(express.urlencoded({extended:false}));


//schedule reminders for the user to water if necessary
var rule = new schedule.RecurrenceRule();
rule.minute = 16;
rule.hour = 11;
var j = schedule.scheduleJob(rule, function(){
  getWeather().then(function(rain, error){
    if(error){
      throw error;
    }
    else {
        //include twilio here
        console.log("it rained " + rain + " here");
        if(rain > 10){
          // client.messages
          //   .create({
          //      body: "It rained " + rain + "mm at your location this week, don't water your plants!",
          //      from: '+12029316022',
          //      to: '+12896858297'
          //    })
          //   .then(message => console.log(message.sid));
        }
        else {

            // client.messages
            //   .create({
            //      body: 'It has only rained " + rain + "mm at your location this week, you better water your plants!',
            //      from: '+12029316022',
            //      to: '+12896858297'
            //    })
            //   .then(message => console.log(message.sid));
        }
    }
  })
});


//display index.html as the homepage
app.get('/', (req, res) => {
  var options = {
    root: path.join(__dirname, 'dist/angularapp')
  }
  return res.sendFile('index.html', options);
})


//gather all of the available plants from the database, to be used in dropdown list
app.get('/plants', (req, res) => {
  //get all the plants available in the firestore database
  const plants = [];
  db.collection('plants').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      //add each plant in the collection to the array
      plants.push(doc.data());
    });
    //return the array
    res.send(plants);
  });
});

//gather the user's information
app.get('/user', (req, res) => {
  //get all user's information
  const users = [];
  db.collection('user').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      //add each plant in the collection to the array
      users.push(doc.data());
    });
    //return the array
    res.send(users);
  });
});


//display all the plants in the user's garden
app.get('/garden', function(req, res) {

  //clear the plants in the plantDetails array
  var plantDetails = [];

  //look through all plants which belong to the current user
  db.collection('garden').where('user', '==', 'Erin').get().then((querySnapshot) => {
    //find the number of plants belonging to this user
    var size =  querySnapshot.size;
    querySnapshot.forEach((doc) => {
      //find the plant information for that plant
      db.collection('plants').where('name', '==', doc.data().plant).get().then((querySnapshot) => {

        //add each plant information to a continuous array
        querySnapshot.forEach((doc2) => {
          plantDetails.push(doc2.data());

          //once all plants have been added to the array, send the information to /garden
          if(plantDetails.length == size){
            //send the information to the page
            res.send(plantDetails);
          }
        });
      });
    })
  })
});


//update the user's location
app.post("/updateLoc", urlencodedParser, function(req, res) {

  var docRef = db.collection('user').doc('43fLnN5E2VukfSpuapsX');
  var updateLoc = docRef.update({
    location: req.body.newloc
  });
  res.redirect("/");
});


//add a plant to the garden
app.post('/addPlant', function(req, res) {
  var plant = req.body.data;
  console.log("received " + plant);
  var data
  //add received plant to firestore
  db.collection('garden').doc().set({
    user:"Erin",
    plant:plant
  }).then(function(){
    console.log(plant + " added to the database");
    // res.send({redirect: '/'});
  }).catch(function(error){
    console.log("An error writing the document: " + error);
  });
});


//gather and display the weather information from the API
app.get('/weather', (req, res) => {
    //send the weather to /weather extension
    // console.log("total precipitation throughout the last week: " + sum);
    getWeather().then(function(rain, error){
      if(error){
        throw error;
      }
      res.send(rain);
    })
});


function getWeather(location){
  return new Promise(function(resolve, reject){
    //needed variables
    var location;
    var weather;
    var sum;

    //get today's date
    var today = new Date();
    var newmonth = today.getMonth() + 1;
    //format today's date
    var date = today.getFullYear() + '-' + newmonth + '-' + today.getDate();
    //get last week's date
    today.setDate(today.getDate() - 7);
    //format last week's date
    var prevDate = today.getFullYear() + '-' + today.getMonth() + 1 + '-' + today.getDate();


    //first find the user's current location
    db.collection('user').where('name', '==', 'Erin').get().then((querySnapshot) => {
      querySnapshot.forEach(doc => {
        //the user's location
        location = doc.data().location;
      })

      //get the weather data between the two dates
      request('http://api.worldweatheronline.com/premium/v1/past-weather.ashx?key=7450f73ec6fe449385e171524201901&q=' + location + '&format=json&date=' + prevDate + '&enddate=' + date, { json: true }, (err, result, body) => {
        sum = 0;
        if (err) { return console.log(err); }

        //get the multiple days' weather from api
        weather = body.data.weather;
        //find the number of days covered
        var days = weather.length;

        //loop through the precipitations for the week, add to a total sum
        for (i=0; i<days; i++){
          var hours = weather[i].hourly.length;
          //loop through each documented hour, add to sum
          for (hour=0; hour<hours; hour++){
            sum += parseFloat(weather[i].hourly[hour].precipMM);
          }
        }
        //format the sum as a string and resolve the promise
        sum = sum.toFixed(2)
        resolve(sum.toString());
      });
    })
  });
}

app.listen(port, () => console.log("Listening"));
