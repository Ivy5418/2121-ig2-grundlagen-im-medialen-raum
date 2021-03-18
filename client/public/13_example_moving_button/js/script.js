// Connecting to server. Don't touch this :-)
let socket = io();

let myID, myIndex;
let userList = [];

let readysüd = false;
let readynord = false;
let readyost = false;
let readywest = false;

let colorRow = [
  "#534E8C",
  "#FB8D8F",
  "#E4AD27",
  "#398B9D",
  "#534E8C",
  "#FB8D8F",
  "#E4AD27",
  "#398B9D",
];

let colors = document.getElementsByClassName("color");
let intervalID;
let counter = 0;

function changeColor() {
  console.log(counter);

  $("#button1").css("background-color", colorRow[counter]);

  counter++;
  if (counter > 7) {
    clearInterval(intervalID);
  }
}

// intervalID = window.setInterval(changeColor, 1000);

// Abgeschickt

function handleButtonClick() {
  // console.log("button wurde geklickt");
  socket.emit("serverEvent", { type: "clickStart", user: "ost" });
}

socket.on("connected", function (msg) {
  console.log(msg);
});

// Incoming events

socket.on("serverEvent", function (message) {
  console.log(message);

  let button1 = document.getElementById("button1");

  // Jeder bereit?
  if(message.type == "clickStart") {
    if (message.user == "süd") {
      let y = button1.offsetTop;
      readysüd = true;
    }
  
    if (message.user == "nord") {
      let y = button1.offsetTop;
      readynord = true;
    }
  
    if (message.user == "ost") {
      let x = button1.offsetLeft;
      readyost = true;
    }
  
    if (message.user == "west") {
      let x = button1.offsetLeft;
      readyost = true;
    }

    if (readyost === true && readywest === true && readynord === true){
      
      if (myIndex == 0) {
        colorRow = shuffle(colorRow);
        socket.emit("serverEvent", { type: "colorSet", color: colorRow });
      }
      //if (readyost === true) console.log("funktioniert");
    }
  }
  

  if (message.type == "colorSet") {
    console.log(message.color);
  }
});

socket.on("newUsersEvent", function (gmyID, gmyIndex, guserList) {
  console.log("New users event: ");
  console.log("That's me: " + gmyID);
  console.log("My index in the list: " + gmyIndex);
  console.log("That's the new users: ");
  console.log(guserList);

  myID = gmyID;
  myIndex = gmyIndex;
  userList = guserList;
});

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}
