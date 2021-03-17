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


let i = ["col1", "col4", "col2", "col3", "col5","col6","col7", "col8"];
let len = colors.length;
let colors =  document.getElementsByClassName("color")


let intervalID;
let counter = 0;
nIntervId = setInterval(i, 1000);


function changeColor() {
    counter++;
    for (i = 0; i < colors.length; i++){
        intervalID = window.setInterval(changeColor, 1000);
    };
    console.log(counter);
    if (counter > 7) {
        clearInterval(intervalID)
    }
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
    let readyost = true;
  }

//   if (readysüd === true && readynord === true && readyost === true && readywest === true) {
    if (readyost === true)
console.log("funktioniert");



//   }
});
