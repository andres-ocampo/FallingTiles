var express = require("express");
app = express();
server = require("http").createServer(app)
io = require("socket.io").listen(server);
server.listen(4000);
app.use(express.static(__dirname + "/"));
app.get("/", function (req, res) {
    res.sendfile(__dirname + "/index.html");
});
io.sockets.on("connection", function (socket) {

    socket.on("start", function (data) {
        boardSize = 70;
        var color = true;
        var boardColor = new Array(boardSize);
        for (var i = 0; i <= boardSize; i++) {
            var eachRow = new Array(boardSize);
            for (var j = 0; j <= boardSize; j++) {
                if (color) {
                    eachRow[j] = "#4caf50";
                    color = false;
                }
                else {
                    eachRow[j] = "#66bb6a";
                    color = true;
                }
            }
            boardColor[i] = eachRow;
        }
        io.sockets.emit("started", boardColor);
    });

    socket.on("newPlayer", function (data) {
        io.sockets.emit("playerCreated", data);
    });
    socket.on("move", function (data) {
        io.sockets.emit("moved", data);
    });
});