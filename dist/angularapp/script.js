var modal;
var span = null;
var area;

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

  $.ajax({
    url:'garden/',
    type: 'GET',
    dataType:'json',
    success: (data) => {
      console.log(data);
      var ul = document.getElementById('garden');
      for (i=0; i<data.length;i++){
        var li = document.createElement('li');
        li.innerHTML = data[i].name;
        var ul2 = document.createElement('ul');
        li.appendChild(ul2);
        var li2 = document.createElement('li');
        var li3 = document.createElement('li');
        var li4 = document.createElement('li');
        li2.innerHTML = "Plant Season: " + data[i].plantTime;
        li3.innerHTML = "Sunlight: " + data[i].sunlight;
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
    console.log("need to change the location to " + newLoc);
    $.post("/newLocation", {
        location: $("#newloc").val()
      },
      function(data, status) {
        console.log("Data: " + data + "\nStatus: " + status);
      });
  });


  //get the plants that are listed in the database
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
        option.innerHTML = data[i].name;
        option.value = data[i].id;
        //add the plant to the dropdown list
        drop.options.add(option);
      }
    }
  });
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

//add a new plant to the database
function add(x){
  //pop up a modal box so user can enter information
  modal.style.display = "block";
  //check which plant has been added
}
