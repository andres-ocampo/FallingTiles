
var board = document.getElementById('board');
var context = board.getContext('2d');
var boardColor;

function draw(x, y, data) {
    var players = data.players;
    boardColor = data.board;
    var xlimit = board.width / 2;
    var ylimit = board.height / 2;
    var boardSize = 70;

    xdraw = 0;
    if (x < xlimit) {
        xlimit = 0;
        xdraw = x;
        x = 0;
    } else if (x >= boardSize * 40 - xlimit) {
        var xdr = boardSize * 40 - x - xlimit;
        xdraw = xdr * -1 + xlimit;
        x = boardSize * 40;
        xlimit = board.width;
    } else {
        xdraw = board.width / 2;
    }
    ydraw = 0;
    if (y < ylimit) {
        ylimit = 0;
        ydraw = y;
        y = 0;
    } else if (y >= boardSize * 40 - ylimit) {
        var ydr = boardSize * 40 - y - ylimit;
        ydraw = ydr * -1 + ylimit;
        y = boardSize * 40;
        ylimit = board.height;
    } else {
        ydraw = board.height / 2;
    }

    context.clearRect(0, 0, board.width, board.height);
    for (var i = 0; i <= boardSize; i++) {
        for (var j = 0; j <= boardSize; j++) {
            context.fillStyle = boardColor[i][j];
            context.fillRect(i * 40 - x + xlimit, j * 40 - y + ylimit, 40, 40);
            for (var playerToDraw in players) {
                if (players[playerToDraw].id !== player_pos.id && i * 40 === players[playerToDraw].x && j * 40 === players[playerToDraw].y) {
                    drawPlayer(players[playerToDraw],x,y,xlimit,ylimit);
                }
            }
        }
    }
    drawLocalPlayer(xdraw,ydraw);
}

function drawLocalPlayer(xdraw, ydraw) {
    context.beginPath();
    context.arc(xdraw + 20, ydraw + 20, 17, 0, 2 * Math.PI);
    context.fillStyle = player_pos.color;
    context.fill();
    context.strokeStyle = player_pos.borderColor;;
    context.lineWidth = 40 * 0.1;
    context.stroke();
    context.font = "15pt Arial";
    context.lineWidth = '3';
    context.strokeStyle = "#000000";
    context.fillStyle = "#FFFFFF";
    context.textAlign = "center";
    context.strokeText(player_pos.nick, xdraw + 20, ydraw + 25);
    context.fillText(player_pos.nick, xdraw + 20, ydraw + 25);
}

function drawPlayer(playerToDraw,x,y,xlimit,ylimit) {

    //console.log(playerToDraw.x + " " + playerToDraw.y + " " + playerToDraw.color + " " + playerToDraw.nick);
    context.beginPath();
    context.arc(playerToDraw.x + 20- x + xlimit, playerToDraw.y + 20 - y + ylimit, 17, 0, 2 * Math.PI);
    context.fillStyle = playerToDraw.color;
    context.fill();
    context.strokeStyle = playerToDraw.borderColor;
    context.lineWidth = 40 * 0.1;
    context.stroke();
    context.font = "15pt Arial";
    context.lineWidth = '3';
    context.strokeStyle = "#000000";
    context.fillStyle = "#FFFFFF";
    context.textAlign = "center";
    context.strokeText(playerToDraw.nick, playerToDraw.x + 20- x + xlimit, playerToDraw.y + 25 - y + ylimit);
    context.fillText(playerToDraw.nick, playerToDraw.x + 20- x + xlimit, playerToDraw.y + 25 - y + ylimit);
}
