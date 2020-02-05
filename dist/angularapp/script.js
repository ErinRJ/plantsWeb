var modal;
var span = null;
var area;
var plants = [];
var ddSet = false;

function startup(){
  //display the modal box
  modal = document.getElementById("modalID");
  // var span = document.getElementsByClassName("close")[0];
  span = document.getElementById("close");
  //allow the user to close the modal box
  span.onclick = function() {
    modal.style.display = "none";
  }
//on first load, find the user's set location
  $.ajax({
    url:'user/',
    type: 'GET',
    dataType: 'json',
    success: (data) => {
      area = data[0].location;
      $("#loc").text(area);
    }
  });

//get and display the weather data for that region
  $.ajax({
    url:'weather/',
    type: 'GET',
    dataType: 'json',
    success: (data) => {
      if(data>10){
        $("#water").text("It's rained " + data + "mm this week, don't water those plants");
      }
      else{
        $("#water").text("It's only rained " + data + "mm this week, water those plants");
      }
    }
  });

//displays all plants currently in the GARDEN
  $.ajax({
    url:'garden/',
    type: 'GET',
    dataType:'json',
    success: (data) => {
      //find the list in the html file
      var ul = document.getElementById('garden');

      //loop through the plants
      for (i=0; i<data.length;i++){
        //create a list heading for each plant type
        var li = document.createElement('li');
        li.innerHTML = data[i].name;

        //create sublists for the plant details
        var ul2 = document.createElement('ul');
        li.appendChild(ul2);

        var li2 = document.createElement('li');
        var li3 = document.createElement('li');
        var li4 = document.createElement('li');

        li2.innerHTML = "Plant Season: " + data[i].season;
        li3.innerHTML = "Sunlight: " + data[i].sun;
        li4.innerHTML = "Water Needed (mm): " + data[i].water;

        ul.appendChild(li);
        ul2.appendChild(li2);
        ul2.appendChild(li3);
        ul2.appendChild(li4);
      }
    }
  })

  //change the user's location
  $("#changeLoc").click(function(){
    var newLoc =$("#newloc").val();
    $.post("/newLocation", {
        location: $("#newloc").val()
      },
      function(data, status) {
        console.log("Data: " + data + "\nStatus: " + status);
      });
  });

  //add new plant to the DATABASE
  $("#add").click(function(){
    modal.style.display = "block";
    //display all plants in the database, if not already set
    if (!ddSet){
      $.ajax({
        url:'plants/',
        type: 'GET',
        dataType: 'json',
        success: (data) => {
          //the dropdown list:
          var drop = document.getElementById('list');
          //loop through the available plants
          for(i=0; i<data.length; i++){
            var option = document.createElement("OPTION");
            // plants.push(data[i]);
            option.setAttribute("name", data[i].name);
            option.innerHTML = data[i].name;
            option.value = data[i].name;
            //add the plant to the dropdown list
            drop.options.add(option);
          }
        }
      });
      ddSet = true;
    }
  });
};

function addPlant(){
  var e = document.getElementById("list");
	var result = e.options[e.selectedIndex].value;
  console.log(result);
  $.post("addPlant/",
  {
    data: result
  },
function(data, status){
  alert("data: "+ data);
});
  // axios.post("/addPlant", {
  //   data: result
  // })
  // .then (function (response) {
  //   console.log(response);
  // })
};

//also close the window if the user clicks outside the box
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
//close the modal once new plant is "added"
function submit(){
  modal.style.display = "none";
  var ddl = document.getElementById("list");
  var selectedValue = ddl.options[ddl.selectedIndex].value;

}
