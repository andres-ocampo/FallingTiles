socket = io.connect();
var player; 
$(document).on("ready", function () {
    var randomPosX;
    var randomPosY;
    var arrayDirections = ["N", "S", "E", "W"];
    var randomDirection;
    var direction;
    var id;
    var nick;
    var colorNumber;
    var arrayColors = ["#FD1D1D", "#F3781D", "#98DD04", "#16F8B1", "#2388F9", "#8F24F2", "#F51DF5", "#853720", "#6F6F6F", "#FFFFFF", "#098B1C"];
    var arrayBorders = ["#E00000", "#E96300", "#84C003", "#00E19A", "#0870E5", "#7106D5", "#DD0BDD", "#712D19", "#595959", "#DFDFDF", "#00630F"];
    $("#login").on("click", function () {
        $("#recuadro").slideUp();
        nick = $("#nick").val();
        colorNumber = Math.floor((Math.random() * 10));
        randomDirection = Math.floor((Math.random() * 4));
        direction = arrayDirections[randomDirection];
        randomPosX = Math.floor((Math.random() * 69) + 1) * 40;
        randomPosY = Math.floor((Math.random() * 69) + 1) * 40;
        player = {
            id: socket.id,
            nick: nick,
            score: 0,
            x: randomPosX,
            y: randomPosY,
            color: arrayColors[colorNumber],
            borderColor: arrayBorders[colorNumber],
            direction: direction,
            state: true,
            players: undefined,
            list: "<li id='"+socket.id+"' class='scoreBoard' data-percentage='0' >"+nick+" - "+0+"</li>"
        }
        socket.emit("start", true);
        socket.emit("newPlayer", player);
    });

});