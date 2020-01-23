const express = require('express');
const path = require('path');
const request = require('request');
const mysql = require('mysql');
var bodyParser = require('body-parser');


const app = express();
const port = process.env.PORT || 3000;

//connect to the database
var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'plantsApp'
});

app.use(express.static("dist/angularapp"));
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });


//DISPLAY THE INDEX.HTML FILE AS THE HOMEPAGE
app.get('/', (req, res) => {
  var options = {
    root: path.join(__dirname, 'dist/angularapp')
  }
  return res.sendFile('index.html', options);
})

//DISPLAY ALL OF THE PLANTS IN THE DATABASE
app.get('/plants', (req, res) => {
      //get all the plants available in the database
  var sql = 'SELECT * FROM plants;'
  db.query(sql, function(err, result) {
    //display the result
    res.send(result);
  });
});

//DISPLAY USER INFORMATION
app.get('/user', (req, res) => {
  //get all the plants available in the database
  var sql = 'SELECT * FROM user;'
  db.query(sql, function(err, result) {
    //display the result
    res.send(result);
  });
});

app.post("/updateLoc", urlencodedParser, function(req, res) {
  console.log(req.body.newloc);
  //update the information in the DATABASE
  var sql = 'UPDATE user SET location=' + JSON.stringify(req.body.newloc) + 'WHERE id=1;'
  db.query(sql, function(err, result) {
    //display the result
    res.send("Location changed to " + req.body.newloc);
  });
});


//DISPLAY THE PRECIPITATION FROM WORLDWEATHERONLINE API
app.get('/weather', (req, res) => {
  //find the user's Location
  var sql = "SELECT location FROM user WHERE name = 'Erin';"
  var userLoc;
  db.query(sql, function (err, result) {
    userLoc = JSON.stringify(result[0].location);
    //for one day:
    //'http://api.worldweatheronline.com/premium/v1/weather.ashx?key=7450f73ec6fe449385e171524201901&q=Havana&format=json&num_of_days=1'
    var weather;
    //get today's date & format it
    var today = new Date();
    var date = today.getFullYear() + '-' + today.getMonth() + 1 + '-' + today.getDate();
    //get last week's date & format it
    today.setDate(today.getDate() - 7);
    var prevDate = today.getFullYear() + '-' + today.getMonth() + 1 + '-' + today.getDate();

    var toronto = "toronto"
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
        console.log("-------DAY : " + i);
        for (hour=0; hour<hours; hour++){
          console.log(weather[i].hourly[hour].precipMM);
          sum += parseFloat(weather[i].hourly[hour].precipMM);
        }
      }
      //send the weather to /weather extension
      console.log("total precipitation throughout the last week: " + sum);
      sum = sum.toFixed(2)
      res.send(sum.toString());
    });
  });

})

app.listen(port, () => console.log("Listening"));
