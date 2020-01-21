const express = require('express');
const path = require('path');
const request = require('request');
// const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 3000;

// var connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'plantsApp'
// });

// connection.connect(function(error) {
//   if (error){
//     console.log("Error");
//   }
//   else{
//     console.log("Connected");
//   }
// });

//

app.use(express.static("dist/angularapp"));

//for many days:
// http://api.worldweatheronline.com/premium/v1/past-weather.ashx?key=7450f73ec6fe449385e171524201901&q=Havana&format=json&date=2020-01-15&enddate=2020-01-19
//for one day:
//'http://api.worldweatheronline.com/premium/v1/weather.ashx?key=7450f73ec6fe449385e171524201901&q=Havana&format=json&num_of_days=1'

var weather;
//get today's date & format it
var today = new Date();
var date = today.getFullYear() + '-' + today.getMonth() + 1 + '-' + today.getDate();
//get last week's date & format it
today.setDate(today.getDate() - 7);
var prevDate = today.getFullYear() + '-' + today.getMonth() + 1 + '-' + today.getDate();

//get the weather data for the two dates
request('http://api.worldweatheronline.com/premium/v1/past-weather.ashx?key=7450f73ec6fe449385e171524201901&q=Havana&format=json&date=2020-01-15&enddate=2020-01-19', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  weather = body.data.weather;
  //weather[0].hourly
  var days = weather.length;
  //loop through the precipitations for the week, add to a total sum
  for (i=0; i<days; i++){
    console.log("-------DAY " + i + "-------");
    var hours = weather[i].hourly.length;
    for (hour=0; hour<hours; hour++){
      console.log(weather[i].hourly[hour].precipMM);
    }
    // console.log(hours);
  }
});

app.get('/', (req, res) => {
  var options = {
    root: path.join(__dirname, 'dist/angularapp')
  }
  return res.sendFile('index.html', options);
})

app

app.listen(port, () => console.log("Listening"));
