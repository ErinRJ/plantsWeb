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
//
// function changeLoc(){
//   var newLoc = document.getElementById("newloc").value;
//   console.log("need to change the location to " + newLoc);
//   // $.ajax({
//   //   url:'newLocation/',
//   //   type: 'POST',
//   //   data: newLoc,
//   //   success: (data) => {
//   //     $("#water").text(data);
//   //   }
//   // });
//   $.post("/newLocation", {
//       data: newLoc,
//       success: function(response) {
//           console.log(response);
//       }
//   });
// }


//go through plants in database
//find all those that "water" levels are less than the rain this week



//add a new plant to the database
function add(x){
  //pop up a modal box so user can enter information
  modal.style.display = "block";
  //check which plant has been added
  switch(x){
    case 1:
      document.getElementById("firstP").innerHTML = "test";
      document.getElementById("firstI").innerHTML = "";
      document.getElementById("firstR").innerHTML = '<button onclick="remove(1)">remove</button>';
      break;
    case 2:
      document.getElementById("secondP").innerHTML = "test";
      document.getElementById("secondI").innerHTML = "";
      document.getElementById("secondR").innerHTML = '<button onclick="remove(2)">remove</button>';
      break;
    case 3:
      document.getElementById("thirdP").innerHTML = "test";
      document.getElementById("thirdI").innerHTML = "";
      document.getElementById("thirdR").innerHTML = '<button onclick="remove(3)">remove</button>';
      break;
    case 4:
      document.getElementById("fourthP").innerHTML = "test";
      document.getElementById("fourthI").innerHTML = "";
      document.getElementById("fourthR").innerHTML = '<button onclick="remove(4)">remove</button>';
      break;
    case 5:
      document.getElementById("fifthP").innerHTML = "test";
      document.getElementById("fifthI").innerHTML = "";
      document.getElementById("fifthR").innerHTML = '<button onclick="remove(5)">remove</button>';
      break;
    case 6:
      document.getElementById("sixthP").innerHTML = "test";
      document.getElementById("sixthI").innerHTML = "";
      document.getElementById("sixthR").innerHTML = '<button onclick="remove(6)">remove</button>';
      break;
    default:
      break;
    }

}
//remove plant from the database
function remove(x){
  switch(x){
    case 1:
      document.getElementById("firstP").innerHTML = '<button onclick="add(1)">Add new</button>';
      document.getElementById("firstI").innerHTML = "";
      document.getElementById("firstR").innerHTML = "";
      break;
    case 2:
      document.getElementById("secondP").innerHTML = '<button onclick="add(2)">Add new</button>';
      document.getElementById("secondI").innerHTML = "";
      document.getElementById("secondR").innerHTML = "";
      break;
    case 3:
      document.getElementById("thirdP").innerHTML = '<button onclick="add(3)">Add new</button>';
      document.getElementById("thirdI").innerHTML = "";
      document.getElementById("thirdR").innerHTML = "";
      break;
    case 4:
      console.log("4 pressed");
      document.getElementById("fourthP").innerHTML = '<button onclick="add(4)">Add new</button>';
      document.getElementById("fourthI").innerHTML = "";
      document.getElementById("fourthR").innerHTML = "";
      break;
    case 5:
      document.getElementById("fifthP").innerHTML = '<button onclick="add(5)">Add new</button>';
      document.getElementById("fifthI").innerHTML = "";
      document.getElementById("fifthR").innerHTML = "";
      break;
    case 6:
      document.getElementById("sixthP").innerHTML = '<button onclick="add(6)">Add new</button>';
      document.getElementById("sixthI").innerHTML = "";
      document.getElementById("sixthR").innerHTML = "";
      break;
    default:
      break;
  }
}
