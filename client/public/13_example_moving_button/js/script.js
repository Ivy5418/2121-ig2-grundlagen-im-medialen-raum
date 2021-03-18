// Connecting to server. Don't touch this :-)
let socket = io();

let gameState = "STOP";

let myID, myIndex;
let userList = [];

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

function getMyColor() {
  switch (myIndex) {
    case 0:
      return "#534E8C";
    case 1:
      return "#E4AD27";
    case 2:
      return "#FB8D8F";
    case 3:
      return "#398B9D";
    default:
      console.error("Invalid player index");
      break;
  }
}

function clickOnColor(color) {
  const myColor = getMyColor();

  if (myColor === color) {
    console.log("RIGHT");

    // Emit the correct button press
    socket.emit("serverEvent", { type: "rightColor" });

    // Hide Button after correct press
    $("#colorButton").hide();
  } else if (myColor != color) {
    console.log("WRONG COLOR");

    // Emit the wrong button press
    socket.emit("serverEvent", { type: "wrongColor" });

    // Hide Button after wrong press
    $("#colorButton").hide();
  }
}

/**
 * Change the color of the given button
 * @param {*} changeColorRow
 */
function changeColor(changeColorRow) {
  if (counter === 6) {
    resetGame();
  }

  if (gameState === "RUNNING" && counter < 7) {
    counter++;
    $(".buttonviolet").hide();
    $(".buttonyellow").hide();
    $(".buttonblue").hide();
    $(".buttonpink").hide();
    $("body").css("background-color", changeColorRow[counter]);

    $("#colorButton").show();
    $("#colorButton").prop("value", changeColorRow[counter]);

    setTimeout(() => {
      changeColor(changeColorRow);
    }, 1000);
  }
}

function handleStartClick() {
  counter = 0;
  gameState = "RUNNING";
  // Shuffle and send the color array to the client
  colorRow = shuffle(colorRow);
  socket.emit("serverEvent", { type: "colorSet", color: colorRow });
  $(".button1").hide();
  $(".button2").hide();
}

function handleReadyClick() {
  // Player is ready event
  socket.emit("serverEvent", { type: "clickReady" });

  //FIXME: Comment out now for testing purpose
  // Hides the button after press
  // $(".button1").hide();

  // Shows the start button if everyone is ready
  if (clickCounter === 3) {
    $(".button2").show();
  }
}

/**
 * Listen to all server events
 */
socket.on("serverEvent", (message) => {
  // Count if everyone is ready
  if (message.type == "clickReady") {
    clickCounter++;
  }

  // Changes the color if the game starts
  if (message.type == "colorSet") {
    changeColor(message.color);
  }

  if (message.type == "wrongColor") {
    // Game reset after wrong button press
    console.log("GAME RESET");
    resetGame();
  }
});

function resetGame() {
  gameState = "STOP";
  clickCounter = 0;
  counter = 10;

  $("#colorButton").hide();

  $(".buttonviolet").css("opacity", "20%");
  $(".buttonviolet").show();

  $(".buttonyellow").css("opacity", "20%");
  $(".buttonyellow").show();

  $(".buttonpink").css("opacity", "20%");
  $(".buttonpink").show();

  $(".buttonblue").css("opacity", "20%");
  $(".buttonblue").show();

  getPlayerTiles();

  $(".button1").show();
}

/**
 * Create a new user and assigns it to a player and color
 */
socket.on("newUsersEvent", function (gmyID, gmyIndex, guserList) {
  console.log("New users event: ");
  console.log("That's me: " + gmyID);
  console.log("My index in the list: " + gmyIndex);
  console.log("That's the new users: ");
  console.log(guserList);

  myID = gmyID;
  myIndex = gmyIndex;
  userList = guserList;

  getPlayerTiles();
});

function getPlayerTiles() {
  switch (myIndex) {
    case 0:
      $(".buttonviolet").text("You");
      $(".buttonviolet").css("opacity", "100%");
      $(".buttonviolet").css("background-color", "#534E8C");
      break;
    case 1:
      $(".buttonyellow").text("You");
      $(".buttonyellow").css("opacity", "100%");
      $(".buttonyellow").css("background-color", "#E4AD27");
      break;
    case 2:
      $(".buttonpink").text("You");
      $(".buttonpink").css("opacity", "100%");
      $(".buttonpink").css("background-color", "#FB8D8F");
      break;
    case 3:
      $(".buttonblue").text("You");
      $(".buttonblue").css("opacity", "100%");
      $(".buttonblue").css("background-color", "#398B9D");
      break;
    default:
      console.error("Invalid player index");
      break;
  }
}

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
