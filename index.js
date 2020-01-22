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

//DISPLAY THE INDEX.HTML FILE AS THE HOMEPAGE
app.get('/', (req, res) => {
  var options = {
    root: path.join(__dirname, 'dist/angularapp')
  }
  return res.sendFile('index.html', options);
})

//DISPLAY THE PRECIPITATION FROM WORLDWEATHERONLINE API
app.get('/weather', (req, res) => {
  //for one day:
  //'http://api.worldweatheronline.com/premium/v1/weather.ashx?key=7450f73ec6fe449385e171524201901&q=Havana&format=json&num_of_days=1'
  var weather;
  //get today's date & format it
  var today = new Date();
  var date = today.getFullYear() + '-' + today.getMonth() + 1 + '-' + today.getDate();
  //get last week's date & format it
  today.setDate(today.getDate() - 7);
  var prevDate = today.getFullYear() + '-' + today.getMonth() + 1 + '-' + today.getDate();

  //get the weather data between the two dates
  request('http://api.worldweatheronline.com/premium/v1/past-weather.ashx?key=7450f73ec6fe449385e171524201901&q=Dublin&format=json&date=' + prevDate + '&enddate=' + date, { json: true }, (err, result, body) => {
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
})

app.listen(port, () => console.log("Listening"));
