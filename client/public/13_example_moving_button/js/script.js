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
let clickCounter = 0;

function changeColor(changeColorRow) {
  console.log(counter);

  $(".button").css("display", "none");
  $(".buttonviolet").css("display", "none");
  $(".buttonyellow").css("display", "none");
  $(".buttonblue").css("display", "none");
  $(".buttonpink").css("display", "none");
  $("body").css("background-color", changeColorRow[counter]);

  counter++;

  if (counter < 7) {
    setTimeout(() => {
      changeColor(changeColorRow);
    }, 1000);
  }
}

// intervalID = window.setInterval(changeColor, 1000);

// Abgeschickt

function handleButtonClick() {
  // console.log("button wurde geklickt");
  socket.emit("serverEvent", { type: "clickStart" });
  $(".button").css("pointer-events", "none");
}

socket.on("connected", function (msg) {
  console.log(msg);
});

// Incoming events

socket.on("serverEvent", function (message) {
  console.log(message);

  let button1 = document.getElementById("button1");

  // Jeder bereit?
  if (message.type == "clickStart") {
    clickCounter++;
    console.log(userList.length);
    console.log(clickCounter);

    if (clickCounter == userList.length) {
      if (myIndex == 0) {
        colorRow = shuffle(colorRow);
        socket.emit("serverEvent", { type: "colorSet", color: colorRow });
      }
    }

    if (message.type == "colorSet") {
      changeColor(message.color);
      console.log(message.color);
    }
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

  if (myIndex == 0) {
    $(".buttonviolet").text("You");
    $(".buttonviolet").css("opacity", "100%");
    $(".buttonviolet").css("background-color", "#534E8C");
  }

  if (myIndex == 1) {
    $(".buttonyellow").text("You");
    $(".buttonyellow").css("opacity", "100%");
    $(".buttonyellow").css("background-color", "#E4AD27");
  }

  if (myIndex == 2) {
    $(".buttonpink").text("You");
    $(".buttonpink").css("opacity", "100%");
    $(".buttonpink").css("background-color", "#FB8D8F");
  }

  if (myIndex == 3) {
    $(".buttonblue").text("You");
    $(".buttonblue").css("opacity", "100%");
    $(".buttonblue").css("background-color", "#398B9D");
  }
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
