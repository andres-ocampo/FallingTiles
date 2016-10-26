socket = io.connect();
$(document).on("ready", function () {
    
    var nick = $("#nick");
    var login = $("#login").on("click", function () {

        $("#recuadro").slideUp();
        socket.emit("start", true);
        socket.emit("newPlayer", true);
    });

    socket.on("playerCreated", function (data) {
        draw(randomPosX,randomPosY);
        context.font = "15pt Arial";
        context.fillStyle = "black";
        context.textAlign = "center";
        context.fillText("Tu bola empezará a desplazarse en unos segundos", board.width/2, board.height/2-120);
        context.fillText("Usa las flechas para darle dirección", board.width/2, board.height/2-80);
        context.fillText("Pulsa la barra espaciadora si no quieres esperar", board.width/2, board.height/2-40);
    });
});