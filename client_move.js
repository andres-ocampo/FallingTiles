var randomPosX;
var randomPosY;
var player_pos;
var timeout = 0;
var movementLoop = 0;

socket.on("playerCreated", function (data) {

    if (player.score == 0) {
        $("#playersList li").remove();
        for (var playerToDraw in data.players) {
            $("#playersList").append(data.players[playerToDraw].list);
        }
    } else {
        $("#playersList").append(data.list);
    }
    if (player != undefined) {
        player_pos = player;
        socket.on("moved", function (data) {
            for (var playerToDraw in data.players) {
                $("#" + data.players[playerToDraw].id).text(data.players[playerToDraw].nick + " " + data.players[playerToDraw].score);
                $("#" + data.players[playerToDraw].id).attr("data-percentage", data.players[playerToDraw].score);
            }
            $("#playersList").find(".scoreBoard").sort(function (a, b) {
                return +a.getAttribute('data-percentage') - +b.getAttribute('data-percentage');
            }).appendTo($("#playersList"));
            [].reverse.call($("#playersList li")).appendTo("#playersList");
            draw(player_pos.x, player_pos.y, data);
        });
    }
});
$("#login").on("click", function () {
    timeout = setTimeout(function () { movementLoop = setInterval(movement, 200) }, 5000);
});


$("body").on("keydown", function (event) {
    if (event.keyCode == 37) {
        player_pos.direction = "W";
    } else if (event.keyCode == 38) {
        player_pos.direction = "N";
    } else if (event.keyCode == 39) {
        player_pos.direction = "E";
    } else if (event.keyCode == 40) {
        player_pos.direction = "S";
    } else if (event.keyCode == 32) {
        if (movementLoop == 0) {
            clearTimeout(timeout);
            movementLoop = setInterval(movement, 200);
        }
    }
    else {
        return;
    }
});

function movement() {
    switch (player_pos.direction) {
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
            return;
    }

    if (player_pos.x < 0) {
        player_pos.x = 0;
    } else if (player_pos.x > 2760) {
        player_pos.x = 2760;
    } else if (player_pos.y < 0) {
        player_pos.y = 0;
    } else if (player_pos.y > 2760) {
        player_pos.y = 2760;
    }
    player_pos.score++;
    socket.emit("move", player_pos);

}

socket.on("lost", function (data) {
    if (data.x == player_pos.x && data.y == player_pos.y && (data.board[data.x / 40][data.y / 40] == "#000000" || data.board[data.x / 40][data.y / 40] == "#212121")) {
        setTimeout(function () {
            $("#recuadro").slideDown();
            $("#lost").show();
        }, 800);
        $("#nick").val('');
        player_pos.state = false;
        player_pos.score = 0;
        clearInterval(movementLoop);
    }
    $("#" + data.id).remove();
});

socket.on("leave", function (data) {
    $("#" + data).remove();
});

