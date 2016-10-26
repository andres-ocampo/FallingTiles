//var socket = socket;
var randomPosX = Math.floor((Math.random() * 20) + 1) * 40;
var randomPosY = Math.floor((Math.random() * 20) + 1) * 40;
var player_pos = {
    x: randomPosX,
    y: randomPosY
}
var arrayDirections = ["N", "S", "E", "W"];
var randomDirection = Math.floor((Math.random() * 4));
var timeout = 0;
var direction = arrayDirections[randomDirection];

$("#login").on("click", function () {
    timeout = setTimeout(function () { setInterval(movement, 300) }, 5000);
});

$("body").on("keydown", function (event) {
    console.log(event.keyCode);
    if (event.keyCode == 37) {
        direction = "W";
    } else if (event.keyCode == 38) {
        direction = "N";
    } else if (event.keyCode == 39) {
        direction = "E";
    } else if (event.keyCode == 40) {
        direction = "S";
    } else if (event.keyCode == 32) {
        clearTimeout(timeout);
        setInterval(movement, 200);
    }
    else {
        return;
    }
});

function movement() {

    switch (direction) {
        case "E":
            player_pos.x += 40;
            break;
        case "W":
            player_pos.x -= 40;
            break;
        case "N":
            player_pos.y -= 40;
            break;
        case "S":
            player_pos.y += 40;
            break;
        default:
            break;
    }

    if (player_pos.x < 0) {
        player_pos.x = 0;
    } else if (player_pos.x >2760) {
        player_pos.x = 2760;
    } else if (player_pos.y < 0) {
        player_pos.y = 0;
    } else if (player_pos.y > 2760) {
        player_pos.y = 2760;
    }
    socket.emit("move", player_pos);

}

socket.on("moved", function (data) {

    var move = {
        left: data.x,
        top: data.y
    }
    var positionColorX = parseInt(move.left) / 40;
    var positionColorY = parseInt(move.top) / 40;
    if (boardColor[positionColorX][positionColorY] == "#000000" || boardColor[positionColorX][positionColorY] == "#212121") {
        alert("Lost");
    }

    //dark Green
    if (boardColor[positionColorX][positionColorY] == "#4caf50") {
        //context.fillStyle = "#ffeb3b";
        boardColor[positionColorX][positionColorY] = "#ffeb3b";
    }
    else if (boardColor[positionColorX][positionColorY] == "#66bb6a") {
        boardColor[positionColorX][positionColorY] = "#fff59d";
        context.fillStyle = "#fff59d";
    }
    else if (boardColor[positionColorX][positionColorY] == "#ffeb3b") {
        context.fillStyle = "#000000";
        boardColor[positionColorX][positionColorY] = "#000000";
    }
    else if (boardColor[positionColorX][positionColorY] == "#fff59d") {
        context.fillStyle = "#212121";
        boardColor[positionColorX][positionColorY] = "#212121";
    }
    draw(player_pos.x, player_pos.y);

    //context.fillRect(parseInt(move.left),parseInt(move.top),40,40);
});