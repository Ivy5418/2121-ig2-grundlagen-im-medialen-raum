// Connecting to server. Don't touch this :-) 
let socket = io();


// Your script starts here ------------------------------------------------------

let myPlayerIndex = 0;
let playerColors = ['#f80', '#08f', '#80f', '#0f8', '#8f0', '#f08']
let playerCount = 0;
let whosTurn = 0;

let shipSetCount = 0;

let shipCounter = 0;
let shipNumber = 0;

let gridSize = 10;
$('.wrapper').children().remove();
$('.wrapper').css("grid-template-columns", "repeat(" + gridSize + ", 50px)");
for (let i = 0; i < gridSize * gridSize; i++) {
    $('.wrapper').append('<div class="cell empty"></div>');
}

let setArray = [];
let arrayFilter = [];
let allShipsArray = [];
let allPlayerShipsArray = [];

$('.ship4').click(function () {
    $('.wrapperShip .cell').not(".ready").css("background-color", "white");
    $('.ship4').css("background-color", playerColors[myPlayerIndex]);
    setArray = ["start"];
    shipCounter = 4;
    shipNumber = 4;
});

$('.ship3').click(function () {
    $('.wrapperShip .cell').not(".ready").css("background-color", "white");
    $('.ship3').css("background-color", playerColors[myPlayerIndex]);
    setArray = ["start"];
    shipCounter = 3;
    shipNumber = 3;
});

$('.ship2').click(function () {
    $('.wrapperShip .cell').not(".ready").css("background-color", "white");
    $('.ship2').css("background-color", playerColors[myPlayerIndex]);
    setArray = ["start"];
    shipCounter = 2;
    shipNumber = 2;
});

$('.ship1').click(function () {
    $('.wrapperShip .cell').not(".ready").css("background-color", "white");
    $('.ship1').css("background-color", playerColors[myPlayerIndex]);
    setArray = ["start"];
    shipCounter = 1;
    shipNumber = 1;
});


$('.wrapper .cell').click(function () {
    if (shipCounter > 0) {
        checkPosition($(this));
    }

    if (allPlayerShipsArray.length == playerCount) {
        if (whosTurn == myPlayerIndex && $(this).hasClass("empty")) {
            socket.emit('serverEvent', { type: "played", playerIndex: myPlayerIndex, cellIndex: $(this).index()});
        }
    }

});

function checkPosition(that) {

    if (setArray[0] != "start") {

        if (shipCounter == shipNumber - 1) {
            arrayFilter = setArray.filter(function (element) {
                return that.index() == element - 10 || that.index() == element + 10 || that.index() == element - 1 || that.index() == element + 1;
            })

            if (that.index() == setArray[0] - 1 || that.index() == setArray[0] + 1) {
                shipOrientation = "horizontal";
            } else {
                shipOrientation = "vertical";
            }
        } else {
            if (shipOrientation == "horizontal") {
                arrayFilter = setArray.filter(function (element) {
                    return that.index() == element - 1 || that.index() == element + 1;
                })
            } else {
                arrayFilter = setArray.filter(function (element) {
                    return that.index() == element - 10 || that.index() == element + 10;
                })
            }
        }

        if (arrayFilter.length != 0) {
            that.css("background-color", playerColors[myPlayerIndex]);
            shipCounter--;
            setArray.push(that.index());
            allShipsArray.push(that.index());
        }
    } else {
        setArray = [];
        that.css("background-color", playerColors[myPlayerIndex]);
        shipCounter--;
        setArray.push(that.index());
        allShipsArray.push(that.index());
    }

    if (shipCounter == 0) {
        $('.ship' + shipNumber).addClass('ready');
        if ($(".wrapperShip .cell").not(".ready").length == 0) {
            socket.emit('serverEvent', { type: "shipSet", playerIndex: myPlayerIndex, allShipsArray: allShipsArray });
        }
    }


}

// Incoming events 
socket.on('connected', function (msg) {
    console.log(msg);
    socket.emit('serverEvent', { type: "reset" });
});

socket.on('serverEvent', function (message) {
    console.log("Incoming event: ", message);

    if (message.type == "reset") {
        whosTurn = 0;
        $('.cell').addClass("empty");
        $('.cell').removeClass("set");
    }

    if (message.type == "played") {
        if (whosTurn == myPlayerIndex) {
            console.log("player")
            let cell = $('.wrapper').children()[message.cellIndex];
            cell = $(cell);
            cell.removeClass("empty");
            cell.addClass('shotShip');
        } else {
            let filterShot = allPlayerShipsArray.filter(function (row) {
                return row.includes(message.cellIndex);
            });

            if(filterShot.length > 0) {
                socket.emit('serverEvent', { type: "shipShotDown", playerIndex: whosTurn, cellIndex: message.cellIndex, hitPlayerIndex: myPlayerIndex });
            }
        }

        whosTurn++;
        if (whosTurn >= playerCount) {
            whosTurn = 0;
        }
        updateStatus();
    }

    if (message.type == "shipShotDown") {
        if (message.playerIndex == myPlayerIndex) {
            let cell = $('.wrapper').children()[message.cellIndex];
            cell = $(cell);
            cell.addClass('shotDown');
            removeElement(allPlayerShipsArray[message.hitPlayerIndex], message.cellIndex);
            console.log(allPlayerShipsArray[message.hitPlayerIndex])
            if(allPlayerShipsArray[message.hitPlayerIndex].length == 0) {
                socket.emit('serverEvent', { type: "winner", winnerIndex: message.playerIndex });
            }
        }
    }

    if (message.type == "winner") {
        if (message.winnerIndex == myPlayerIndex) {
            $('#play-status').html("Gratulations, you are the winner.");
        } else {
            $('#play-status').html("Sorry, you are the looser.");
        }
    }


    if (message.type == "shipSet") {
        allPlayerShipsArray[message.playerIndex] = message.allShipsArray;
        shipSetCount++;
        updateStatus();
    }

});

socket.on('newUsersEvent', function (myID, myIndex, userList) {
    console.log("New users event: ");
    console.log("That's me: " + myID);
    console.log("My index in the list: " + myIndex);
    console.log("That's the new users: ");
    console.log(userList);

    playerCount = userList.length;
    myPlayerIndex = myIndex;

    updateStatus();
});

function updateStatus() {
    $('#player-status').html("There are " + playerCount + " players connected");

    $('.wrapper .cell').css("color", playerColors[myPlayerIndex]);

    $('#playcolor').css("background-color", playerColors[myPlayerIndex]);
    $('body').css("background-color", playerColors[myPlayerIndex] + "4"); // background color like playing color but less opacity

    if (shipSetCount == playerCount) {
        $('#play-status').html("All players did set their ships.");
    }
    if (whosTurn == myPlayerIndex) {
        $('#play-status').html("It's your turn.");
    } else {
        $('#play-status').html("Waiting for player " + (whosTurn + 1) + ".");
    }
}

function removeElement(array, elem) {
    var index = array.indexOf(elem);
    if (index > -1) {
        array.splice(index, 1);
    }
}