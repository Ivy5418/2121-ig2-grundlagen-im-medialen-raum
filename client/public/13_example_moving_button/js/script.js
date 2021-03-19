// Connecting to server. Don't touch this :-)
let socket = io();

let myID;
let myIndex;
let userList = [];

let gameState = "STOP";
let counterRightClicks = 0;
let wonRounds = 0;
let timeInterval = 1000;

let colorRow = ["#534e8c", "#e4ad27", "#fb8d8f", "#398b9d", "#534e8c", "#e4ad27", "#fb8d8f", "#398b9d"];

let colors = document.getElementsByClassName("color");
let intervalID;
let counter = 0;
let clickCounter = 0;


// User interaction --------------------------------------------------------------------------------------------

function handleStartClick() {
  socket.emit("serverEvent", { type: "gameStart" });
}

function handleReadyClick() {
  // Player is ready event
  $(".button1").hide();
  socket.emit("serverEvent", { type: "clickReady", data: { id: myID } });
  //checkForReadiness();
}

function clickOnColor(color) {
 
  const myColor = getMyColor();

  if (myColor === color) {
    console.log("RIGHT");

    // Emit the correct button press
    socket.emit("serverEvent", { type: "rightColor" });

  } else if (myColor != color) {
    console.log("WRONG COLOR");

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

  if (message.type == "initGame") {
    // Game reset after wrong button press
    console.log("GAME INIT");
    initGame();
  }

  // Count if everyone is ready
  if (message.type == "clickReady") {
    //FIXME: Comment out now for testing purpose
    // Hides the button after press
   
    clickCounter++;

    console.log(`PLAYER WITH ID: ${message.data.id} IS READY`);
    // Shows the start button if everyone is ready
    checkForReadiness();
  }

  // Changes the color if the game starts
  if (message.type == "colorSet") {
    changeColor(message.color);
  }

  // Changes the color if the game starts
  if (message.type == "gameStart") {
    gameStart();
  }

  // Add up the right Answerers
  if (message.type == "rightColor") {
    // Hide Button after correct press
    $("#colorButton").hide();

    counterRightClicks++;
    console.log(`RIGHT COLOR NUMBER ${counterRightClicks}`);
  }

  if (message.type == "wrongColor") {
    // Hide Button after wrong press
    $("#colorButton").hide();

    // Game reset after wrong button press
    console.log("GAME RESET");
    resetGame();
  }
});

// Functions ---------------------------------------------------------------------------------------------------



function initGame() {
  gameState = "STOP";
  console.log("resetGameStop");
  clickCounter = 0;
  counter = 0;
  wonRounds = 0;
  timeInterval = 1000;
  counterRightClicks = 0;

  // Handle UI elements
  $("#colorButton").hide();
  $(".buttonviolet").show();
  $(".buttonyellow").show();
  $(".buttonpink").show();
  $(".buttonblue").show();
  $(".button1").show();

  getPlayerTiles();
}


function resetGame() {
  gameState = "STOP";
  console.log("resetGameStop");
  clickCounter = 0;
  counter = 0;

  // Handle UI elements
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
  console.log(clickCounter)
  if (clickCounter === 4) {
    console.log("READY TO START");

    if (myIndex == 0)
      $(".button2").show();
  }
}


function handleGameResult() {
  // Create a new div which gets deleted on reset later on
  $(".resultCardContainer").show();
  if (counterRightClicks === 8) {
    $(".resultCard").append(`<p id="resultText">YOU WON</p>`);
    $(".resultCard").append(`<p id="resultText">YOUR SCORE WAS ${counterRightClicks}</p>`);
    // Count up the won rounds
    wonRounds++;
  } else {
    $(".resultCard").append(`<p id="resultText">YOU LOST</p>`);
    $(".resultCard").append(`<p id="resultText">YOUR SCORE WAS ${counterRightClicks}</p>`);
    // Reset the won rounds
    wonRounds = 0;
  }
}


function gameStart() {
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
  console.log("changeColor", counter, gameState);

  // Reset the game after all colors are displayed
  if (counter === 8) {
    resetGame();
  }

  /* if (gameState === "RUNNING" && counter != counterRightClicks) {
     console.log("TIME ELAPSED");
     resetGame();
   }*/

  if (counter < 8 && gameState === "RUNNING") {
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
    }, timeInterval);
  }

}


/**
 * Calculate the current time Interval
 * @returns
 */
function getCurrentTimeInterval() {
  console.log(wonRounds);
  if (wonRounds === 0) {
    return (timeInterval = 1000);
  } else return timeInterval / wonRounds;
}

function transferColor() {
  // Set the new colors for every client
  // Shuffle and send the color array to the client
  colorRow = shuffle(colorRow);
  socket.emit("serverEvent", { type: "colorSet", color: colorRow });
}



function getMyColor() {
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
