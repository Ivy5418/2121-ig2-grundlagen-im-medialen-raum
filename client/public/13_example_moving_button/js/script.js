// Connecting to server. Don't touch this :-)
let socket = io();

function handleButtonClick() {
  // console.log("button wurde geklickt");
  socket.emit("serverEvent", "nord");
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
});
