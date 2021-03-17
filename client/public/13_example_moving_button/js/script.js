// Connecting to server. Don't touch this :-)
let socket = io();

let readysüd = false;
let readynord = false;
let readyost = false;
let readywest = false;

function handleButtonClick() {
  // console.log("button wurde geklickt");
  socket.emit("serverEvent", "ost");
}

socket.on("connected", function (msg) {
  console.log(msg);
});
// Incoming events
socket.on("serverEvent", function (message) {
  console.log(message);

  let button1 = document.getElementById("button1");

  if (message == "süd") {
    let y = button1.offsetTop;

  }

  if (message == "nord") {
    let y = button1.offsetTop;
    
  }

  if (message == "ost") {
    let x = button1.offsetLeft;
  
  }

  if (message == "west") {
    let x = button1.offsetLeft;
    
  }

  if{
    console.log("funktioniert");
  }
});
