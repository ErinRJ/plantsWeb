const express = require('express');
const path = require('path');
const request = require('request');
const mysql = require('mysql');
var bodyParser = require('body-parser');
const firebase = require('firebase');


const app = express();
var router = express.Router();
const port = process.env.PORT || 3000;

//connect to the database
// var db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'root',
//   database: 'plantsApp',
//   port: 3306
// });

//set up Twilio for SMS notifications
// const accountSid = 'ACe9f6714e786c1e39dfed4170a001e1fa';
// const authToken = '7a4e61ffbd1df8649d5ebab6f921691f';
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

//DISPLAY THE INDEX.HTML FILE AS THE HOMEPAGE
app.get('/', (req, res) => {
  var options = {
    root: path.join(__dirname, 'dist/angularapp')
  }
  return res.sendFile('index.html', options);
})



//DISPLAY ALL OF THE PLANTS IN THE DATABASE
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

  // var sql = 'SELECT * FROM plants;'
  // db.query(sql, function(err, result) {
  //   //display the result
  //   res.send(result);
  // });
});



//DISPLAY THE USER INFORMATION
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

  // var sql = 'SELECT * FROM user;'
  // db.query(sql, function(err, result) {
  //   //display the result
  //   res.send(result);
  // });
});



//DISPLAY ALL THE PLANTS IN THE GARDEN
app.get('/garden', function(req, res) {

  // var plants="";
  // var jsonObject;
  // var sql = 'SELECT * FROM garden;'

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


  // db.query(sql, function(err, result) {
  //   //loop through the plants and find their information
  //   for(i=0;i<result.length;i++){
  //     console.log(result[i].plant);
  //     plants += "id=" + result[i].plant;
  //     if(i != result.length-1){
  //       plants += " OR ";
  //     }
  //   }
  //   //collect all the different ids
  //   var sql2 = 'SELECT * FROM plants WHERE ' + plants + ';'
  //   db.query(sql2, function(err, result){
  //     console.log(result);
  //     jsonObject = JSON.stringify(result);
  //     res.send(jsonObject)
  //   });
  // });
});


//UPDATE THE USER'S LOCATION
app.post("/updateLoc", urlencodedParser, function(req, res) {

  var docRef = db.collection('user').doc('43fLnN5E2VukfSpuapsX');
  var updateLoc = docRef.update({
    location: req.body.newloc
  });
  res.redirect("/");



  //update the information in the DATABASE
  // var sql = 'UPDATE user SET location=' + JSON.stringify(req.body.newloc) + 'WHERE id=1;'
  // db.query(sql, function(err, result) {
  //   //display the result
  //   res.send("Location changed to " + req.body.newloc);
  // });
  // db.ref('location/' + 1).set({
  //   location: JSON.stringify(req.body.newloc)
  // });
});


//add a plant to the garden
app.post('/addPlant', function(req, res, next) {
  var name = req.body.data;
  console.log(req.body.data);

  //add received plant to firestore

  res.redirect('/');
});


// app.post("/addPlant", urlencodedParser, function(req, res) {
//   console.log("===================REEEEEEEQ: " + req.body);
//   //update the information in the DATABASE
//   // var sql = 'SELECT * FROM plants WHERE id=' + req.body.plant_id;
//   // db.query(sql, function(err, result) {
//   //   //display the result
//   //   res.send("Location changed to " + req.body.newloc);
//   // });
//   res.send("yi");
// });

//DISPLAY THE PRECIPITATION FROM WORLDWEATHERONLINE API
app.get('/weather', (req, res) => {

  //find the user's current location
  db.collection('user').where('name', '==', 'Erin').get().then((querySnapshot) => {
    querySnapshot.forEach(doc => {
      //the user's location
      var userLoc = doc.data().location;

      //find the weather
      var weather;
      //get today's date & format it
      var today = new Date();
      var newmonth = today.getMonth() + 1;

      //format today's date
      var date = today.getFullYear() + '-' + newmonth + '-' + today.getDate();
      //get last week's date & format it
      today.setDate(today.getDate() - 7);

      //format last week's date
      var prevDate = today.getFullYear() + '-' + today.getMonth() + 1 + '-' + today.getDate();

      //get the weather data between the two dates
      request('http://api.worldweatheronline.com/premium/v1/past-weather.ashx?key=7450f73ec6fe449385e171524201901&q=' + userLoc + '&format=json&date=' + prevDate + '&enddate=' + date, { json: true }, (err, result, body) => {

        if (err) { return console.log(err); }

        //get the multiple days' weather from api
        weather = body.data.weather;
        //find the number of days covered
        var days = weather.length;

        //loop through the precipitations for the week, add to a total sum
        var sum = 0;
        for (i=0; i<days; i++){
          var hours = weather[i].hourly.length;
          //loop through each documented hour, add to sum
          for (hour=0; hour<hours; hour++){
            sum += parseFloat(weather[i].hourly[hour].precipMM);
          }
        }

        //send the weather to /weather extension
        console.log("total precipitation throughout the last week: " + sum);
        sum = sum.toFixed(2)
        res.send(sum.toString());
      });
    })
  });



  // //new location:
  // var userLoc;
  // //find the user's current Location
  // var sql = "SELECT location FROM user WHERE name = 'Erin';"
  // db.query(sql, function (err, result) {
  //   userLoc = JSON.stringify(result[0].location);
    //for one day:
    //'http://api.worldweatheronline.com/premium/v1/weather.ashx?key=7450f73ec6fe449385e171524201901&q=Havana&format=json&num_of_days=1'
});

module.exports = router;
app.listen(port, () => console.log("Listening"));
