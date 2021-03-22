/**
 * CURRENT TODO:´s and FIXME:´s
 *
 * FIXME: After the time elapse if statement the the game reset gets  triggered twice (Game should only rest once => Currently fixed with an if statement to check for game state)
 *
 *
 */

// Connecting to server. Don't touch this :-)
let socket = io();

let myID;
let myIndex;
let userList = [];

let gameState = "STOP";
let counterRightClicks = 0;
let wonRounds = 0;
let timeInterval = 1000;
let totalClicks = 0;

let colorRow = ["#534e8c", "#e4ad27", "#fb8d8f", "#398b9d", "#534e8c", "#e4ad27", "#fb8d8f", "#398b9d"];

let colors = document.getElementsByClassName("color");
let intervalID;
let counter = 0;
let clickCounter = 0;
let myLastColorClick = -1; // remember which color index has been clicked by me

// User interaction --------------------------------------------------------------------------------------------

function handleReadyClick() {
  console.log("handleReadyClick");
  // Player is ready event
  $(".button1").hide();
  $(".resultCard").hide();
  socket.emit("serverEvent", { type: "clickReady", data: { id: myID } });
  //checkForReadiness();
}

function handleStartClick() {
  console.log("handleStartClick");
  socket.emit("serverEvent", { type: "gameStart" });
}

function clickOnColor(color) {
  console.log("clickOnColor");

  const myColor = getMyColor();

  if (myColor === color && myLastColorClick < counter) {
    myLastColorClick = counter;
    // Emit the correct button press
    socket.emit("serverEvent", { type: "rightColor" });
  } else if (myColor != color && myLastColorClick < counter) {
    myLastColorClick = counter;
    // Emit the wrong button press
    socket.emit("serverEvent", { type: "wrongColor" });
  }
}

// Server events ------------------------------------------------------------------------------------------------

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

  socket.emit("serverEvent", { type: "initGame" });
});

/**
 * Listen to all server events
 */
socket.on("serverEvent", (message) => {
  console.log(`%cNEW SERVER EVENT FROM TYPE: ${message.type}  TRANSFER DATA: ${message.data ?? "NO DATA IN CURRENT REQUEST"}`, "color:blue");

  if (message.type == "initGame") {
    // Game reset
    initGame();
  }

  // Count if everyone is ready
  if (message.type == "clickReady") {
    clickCounter++;
    // Shows the start button if everyone is ready
    checkForReadiness();
  }

  // Changes the color if the game starts
  if (message.type == "colorSet") {
    changeColor(message.data);
  }

  // Starts the game
  if (message.type == "gameStart") {
    gameStart();
  }

  // Add up the right Answerers
  if (message.type == "rightColor") {
    // Hide Button after correct press
    counterRightClicks++;
    console.log(`RIGHT COLOR NUMBER ${counterRightClicks}`);
  }

  if (message.type == "wrongColor") {
    // Game reset after wrong button press
    gameOver();
  }

  if (message.type == "resetGame") {
    // Game reset after event call
    if (gameState === "RUNNING") {
      gameOver();
    }
  }
});

// Functions ---------------------------------------------------------------------------------------------------

function initGame() {
  gameState = "STOP";
  console.log("initGame");
  clickCounter = 0;
  counter = 0;
  wonRounds = 0;
  timeInterval = 1000;
  counterRightClicks = 0;
  totalClicks = 0;

  // Handle UI elements
  $("#colorButton").hide();
  $(".buttonviolet").show();
  $(".buttonyellow").show();
  $(".buttonpink").show();
  $(".buttonblue").show();
  $(".button1").show();

  getPlayerTiles();
}

function gameOver() {
  console.log(`%cGAME OVER`, "color:red");

  gameState = "STOP";
  clickCounter = 0;
  counter = 0;
  counterRightClicks = 0;
  // Handle UI elements
  $(".resultCard").show();
  $("#colorButton").hide();
  $(".buttonviolet").show();
  $(".buttonyellow").show();
  $(".buttonpink").show();
  $(".buttonblue").show();
  $(".button1").show();

  getPlayerTiles();
  handleGameResult();
}

// player preparation
function getPlayerTiles() {
  switch (myIndex) {
    case 0:
      $(".buttonviolet").text("You");
      $(".buttonviolet").css("opacity", "100%");
      $(".buttonviolet").css("background-color", "#534e8c");
      break;
    case 1:
      $(".buttonyellow").text("You");
      $(".buttonyellow").css("opacity", "100%");
      $(".buttonyellow").css("background-color", "#e4ad27");
      break;
    case 2:
      $(".buttonpink").text("You");
      $(".buttonpink").css("opacity", "100%");
      $(".buttonpink").css("background-color", "#fb8d8f");
      break;
    case 3:
      $(".buttonblue").text("You");
      $(".buttonblue").css("opacity", "100%");
      $(".buttonblue").css("background-color", "#398b9d");
      break;
    default:
      console.error("Invalid player index");
      break;
  }
}

function checkForReadiness() {
  console.log(clickCounter);
  if (clickCounter === 4) {
    console.log("READY TO START");

    if (myIndex == 0) $(".button2").show();
  }
}

function handleGameResult() {
  // Create a new div which gets deleted on reset later on
  $(".resultCardContainer").show();
  if (counterRightClicks === 8) {
    // Count up the won rounds and right clicks
    wonRounds++;
    totalClicks += counterRightClicks;
    counterRightClicks = 0;

    $(".resultCard").css("background-color", "#629559");
    $(".resultCard").append(`<p id="resultText">Your Team made it!</p>`);
    $(".resultCard").append(`<p id="resultText">Level Result ${wonRounds + 1}</p>`);
  } else {
    // Reset the won rounds and total clicks
    wonRounds = 0;
    totalClicks = 0;

    $(".resultCard").css("background-color", "#B64047");
    $(".resultCard").append(`<p id="resultText">Your Team lost</p>`);
    $(".resultCard").append(`<p id="resultText">Level Result ${wonRounds + 1}</p>`);
  }
}

function gameStart() {
  console.log(`%cGAME START`, "color:green");
  if (gameState === "RUNNING") {
    return;
  }

  /** Prepare for game start */
  // Resets the result card on game start
  $(".resultCard").empty();
  // Reset the counter on game start
  counter = 0;

  // Set the game state
  gameState = "RUNNING";

  // Get the current time interval Calculate
  timeInterval = getCurrentTimeInterval();

  // Hide the unused UI elements
  $(".button1").hide();
  $(".button2").hide();
  $(".resultCardContainer").hide();
  transferColor();
}

/**
 * Change the color of the given button
 * @param {*} changeColorRow
 */
function changeColor(changeColorRow) {
  // Reset the game after all colors are displayed
  if (counter === 8) {
    socket.emit("serverEvent", { type: "resetGame" });
    return;
  }

  // // Game Stops if no one presses the color
  // if (gameState === "RUNNING" && counter != counterRightClicks) {
  //   socket.emit("serverEvent", { type: "resetGame" });
  //   return;
  // }

  if (counter < 8 && gameState === "RUNNING") {
    console.log(counter);
    counter++;
    $(".buttonviolet").hide();
    $(".buttonyellow").hide();
    $(".buttonblue").hide();
    $(".buttonpink").hide();
    $("body").css("background-color", changeColorRow[counter]);

    $("#colorButton").show();
    $("#colorButton").prop("value", changeColorRow[counter]);

    // if (myIndex == 0) {
    setTimeout(() => {
      changeColor(changeColorRow);
    }, timeInterval);
    // }
  }
}

/**
 * Calculate the current time Interval
 * @returns
 */
function getCurrentTimeInterval() {
  if (wonRounds === 0) {
    return (timeInterval = 2000);
  } else return timeInterval / wonRounds;
}

function transferColor() {
  // Set the new colors for every client
  // Shuffle and send the color array to the client
  if (myIndex == 0) {
    colorRow = shuffle(colorRow);
    socket.emit("serverEvent", { type: "colorSet", data: colorRow });
  }
}

function getMyColor() {
  console.log("getmycolor");
  switch (myIndex) {
    case 0:
      return "#534e8c";
    case 1:
      return "#e4ad27";
    case 2:
      return "#fb8d8f";
    case 3:
      return "#398b9d";
    default:
      console.error("Invalid player index");
      break;
  }
}

/**
 * Shuffles array in place.
 * @param {Array} array items An array containing the items.
 */
function shuffle(array) {
  var j, x, index;
  for (index = array.length - 1; index > 0; index--) {
    j = Math.floor(Math.random() * (index + 1));
    x = array[index];
    if (array[index] === array[j]) {
      array[index] = array[j + 1];
    } else {
      array[index] = array[j];
    }
    array[j] = x;
  }
  return array;
}
