var board = document.getElementById('board');
var context = board.getContext('2d');
var boardColor = boardColor;
var player = $("#nick").val();
var colorNumber = Math.floor((Math.random() * 10));
var arrayColors = ["#FD1D1D", "#F3781D", "#98DD04", "#16F8B1", "#2388F9", "#8F24F2", "#F51DF5", "#853720", "#6F6F6F", "#FFFFFF", "#098B1C"];
var arrayBorders = ["#E00000", "#E96300", "#84C003", "#00E19A", "#0870E5", "#7106D5", "#DD0BDD", "#712D19", "#595959", "#DFDFDF", "#00630F"];
socket.on("started", function (data) {
    boardColor = data;
});

function draw(x, y) {
    var xlimit = board.width / 2;
    var ylimit = board.height / 2;
    var boardSize = 70;
    
    var xdraw = 0;
    
    if (x < xlimit) {
        xlimit = 0;
        xdraw = x;
        x = 0;
    } else if (x  >= boardSize * 40 - xlimit) {  
      var xdr=boardSize * 40-x-xlimit;
      xdraw=xdr*-1+xlimit;     
      x=boardSize * 40;
      xlimit=board.width;      
    }else {
        xdraw = board.width / 2;
    }
    var ydraw = 0;
    if (y < ylimit) {
        ylimit = 0;
        ydraw = y;
        y = 0;
    }else if (y >= boardSize * 40 - ylimit) {  
      var ydr=boardSize * 40-y-ylimit;
      ydraw=ydr*-1+ylimit;     
      y=boardSize * 40;
      ylimit=board.height;      
    } else {
        ydraw = board.height / 2;
    }

    context.clearRect(0, 0, board.width, board.height);
    for (var i = 0; i <= boardSize; i++) {
        for (var j = 0; j <= boardSize; j++) {
            context.fillStyle = boardColor[i][j];
            context.fillRect(i * 40 - x + xlimit, j * 40 - y + ylimit, 40, 40);
        }
    }
    context.beginPath();
    context.arc(xdraw + 20, ydraw + 20, 17, 0, 2 * Math.PI);
    context.fillStyle = arrayColors[colorNumber];
    context.fill();
    context.strokeStyle = arrayBorders[colorNumber];;
    context.lineWidth = 40 * 0.1;
    context.stroke();
    context.font = "15pt Arial";
    context.lineWidth = '3';
    context.strokeStyle = "#000000";
    context.fillStyle = "#FFFFFF";
    context.textAlign = "center";
    context.strokeText($("#nick").val(), xdraw + 20, ydraw + 25);
    context.fillText($("#nick").val(), xdraw + 20, ydraw + 25);
}