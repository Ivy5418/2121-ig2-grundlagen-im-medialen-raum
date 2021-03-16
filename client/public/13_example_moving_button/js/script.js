// Connecting to server. Don't touch this :-)
let socket = io();
<<<<<<< HEAD
=======
let readysüd = false
let readynord = false
let readyost = false
let readywest = false

>>>>>>> afd807aeb00979d877c1446626abc66721e62e84

function handleButtonClick() {
  // console.log("button wurde geklickt");
  socket.emit("serverEvent", "nord");
}

socket.on("connected", function (msg) {
  console.log(msg);
});

<<<<<<< HEAD
// Incoming events
socket.on("serverEvent", function (message) {
  console.log(message);

  let button1 = document.getElementById("button1");

  if (message == "süd") {
    let y = button1.offsetTop;
    y = y + 20;
    button1.style.top = y + "px";
  }

  if (message == "nord") {
    let y = button1.offsetTop;
    y = y - 20;
    button1.style.top = y + "px";
  }

  if (message == "ost") {
    let x = button1.offsetLeft;
    x = x - 20;
    button1.style.left = x + "px";
  }

  if (message == "west") {
    let x = button1.offsetLeft;
    x = x + 20;
    button1.style.left = x + "px";
  }
=======
// Incoming events 
socket.on('serverEvent', function (message) {
    console.log(message);

    let button1 = document.getElementById("button1");

    if (message == "süd") {
        let y = button1.offsetTop;
        let readysüd = true;
    }

    if (message == "nord") {
        let y = button1.offsetTop;
        let readynord = true;
    }

    if (message == "ost") {
        let x = button1.offsetLeft;
        let readyost = true;
    }

    if (message == "west") {
        let x = button1.offsetLeft;
        let readywest = true;
    }

    if (readysüd === true && readynord === true && readyost === true && readywest === true ) {
        console.log("funktioniert");
    
 
    }

>>>>>>> afd807aeb00979d877c1446626abc66721e62e84
});
