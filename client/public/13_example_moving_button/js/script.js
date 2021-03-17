// Connecting to server. Don't touch this :-)
let socket = io();

let readysüd = false;
let readynord = false;
let readyost = false;
let readywest = false;



let colorRow = ["red", "greenyellow", "yellow", "blueviolet", "khaki", "olivedrab", "blue", "indianred"]
colorRow = shuffle(colorRow);

let colors =  document.getElementsByClassName("color")
let intervalID;
let counter = 0;

function changeColor() {
  console.log(counter);
  
  $('#button1').css("background-color", colorRow[counter])

  counter++;
    if (counter > 7) {
        clearInterval(intervalID)
    } 
}

intervalID = window.setInterval(changeColor, 1000);

// Abgeschickt

function handleButtonClick() {
  // console.log("button wurde geklickt");
  socket.emit("serverEvent", "ost");
}


socket.on("connected", function (msg) {
  console.log(msg);
})

// Incoming events

socket.on("serverEvent", function (message) {
  console.log(message);

  let button1 = document.getElementById("button1");

// Jeder bereit?

  if (message == "süd") {
    let y = button1.offsetTop;
    readysüd = true;
  }

  if (message == "nord") {
    let y = button1.offsetTop;
    readynord = true;
  }

  if (message == "ost") {
    let x = button1.offsetLeft;
    readyost = true;
  }

  if (message == "west") {
    let x = button1.offsetLeft;
    readyost = true;
  }

//   if (readysüd === true && readynord === true && readyost === true && readywest === true) {
    if (readyost === true)
console.log("funktioniert");



//   }
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