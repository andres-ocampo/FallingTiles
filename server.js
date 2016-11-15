var express = require("express");
app = express();
server = require("http").createServer(app)
io = require("socket.io").listen(server);
server.listen(4000);
app.use(express.static(__dirname + "/"));
app.get("/", function (req, res) {
    res.sendfile(__dirname + "/index.html");
});
var startMatch = false;
boardSize = 70;
boardMinorLimit = 0;
var boardColor = new Array(boardSize);
var playersOnServer = {};
var queueToRegeneateDark = [];
io.sockets.on("connection", function (socket) {
    socket.on("start", function (data) {
        if (!startMatch) {
            console.log("First Match");
            startMatch = true;
            var color = true;
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
        }
        else {
            console.log("Any Match");
            io.sockets.emit("started", boardColor);
        }
    });

    socket.on("newPlayer", function (data) {
        console.log("player with id: " + data.id + " has joined");
        var playerServer  = {
            id: data.id,
            nick: data.nick,
            score: data.score,
            x: data.x,
            y: data.y,
            color: data.color,
            borderColor: data.borderColor,
            direction: data.direction,
            state: data.state,
            players: playersOnServer,
            list:data.list
        }
        drawBombs();
        playersOnServer[data.id] = data;
        io.sockets.emit("playerCreated", playerServer);
    });
    function drawBombs() {
        for (var j = 0; j <= 10; j++) {
            var posBombX = Math.floor((Math.random() * 69) + 1);
            var posBombY = Math.floor((Math.random() * 69) + 1);
            if (boardColor[posBombX][posBombY] == "#4caf50") {
                boardColor[posBombX][posBombY] = "#ff0000";
            }
            else {
                boardColor[posBombX][posBombY] = "#fe2e2e";
            }
        }
    }
    socket.on("move", function (data) {
        var positionColorX = parseInt(data.x) / 40;
        var positionColorY = parseInt(data.y) / 40;

        if (boardColor[positionColorX][positionColorY] == "#4caf50") {
            setTimeout(function () { boardColor[positionColorX][positionColorY] = "#ffeb3b" }, 80);
        }
        else if (boardColor[positionColorX][positionColorY] == "#66bb6a") {
            setTimeout(function () { boardColor[positionColorX][positionColorY] = "#fff59d" }, 80);
        }
        else if (boardColor[positionColorX][positionColorY] == "#ffeb3b") {
            setTimeout(function () { boardColor[positionColorX][positionColorY] = "#000000" }, 80);
            var positionsAndColor ={
                x:positionColorX,
                y:positionColorY,
                color:"#000000"
            }
            queueToRegeneateDark.push(positionsAndColor);
            setTimeout(toRegenerateTiles(false), 15000);
        }
        else if (boardColor[positionColorX][positionColorY] == "#fff59d") {
            setTimeout(function () { boardColor[positionColorX][positionColorY] = "#212121" }, 80);
            var positionsAndColor ={
                x:positionColorX,
                y:positionColorY,
                color:"#212121"
            }
            queueToRegeneateDark.push(positionsAndColor);
            setTimeout(toRegenerateTiles(false), 15000);
        }
        else if (boardColor[positionColorX][positionColorY] == "#ff0000") {
            setTimeout(function () { boardColor[positionColorX][positionColorY] = "#4caf50" }, 80);
            //drawing explosion
            drawExplosion("#000000", "#212121", positionColorX, positionColorY);
            //final part of drawing explosion 
        }
        else if (boardColor[positionColorX][positionColorY] == "#fe2e2e") {
            setTimeout(function () { boardColor[positionColorX][positionColorY] = "#66bb6a" }, 80);
            //drawing explosion
            drawExplosion("#212121", "#000000", positionColorX, positionColorY);
            //final part of drawing explosion 
        }

        playersOnServer[data.id] = data;

        var playerAndBoard = {
            id: data.id,
            nick: data.nick,
            x: data.x,
            y: data.y,
            color: data.color,
            borderColor: data.borderColor,
            direction: data.direction,
            state: data.state,
            board: boardColor,
            players: playersOnServer
        }


        if (boardColor[positionColorX][positionColorY] == "#000000" || boardColor[positionColorX][positionColorY] == "#212121") {
            delete playersOnServer[data.id];
            io.sockets.emit("lost", playerAndBoard);
        }

        io.sockets.emit("moved", playerAndBoard);
    });

    socket.on('disconnect', function (data) {
        delete playersOnServer[socket.id];
        io.sockets.emit("leave", socket.id);
    });

    function toRegenerateTiles(varBool){
        var time = 15000;
        if(varBool){
            time = 25000;
        }
        var theFirst = queueToRegeneateDark.shift();
        if(theFirst.color == "#000000"){
            setTimeout(function () { boardColor[theFirst.x][theFirst.y]="#4caf50"}, time);
        } 
        else if(theFirst.color == "#212121"){
            setTimeout(function () { boardColor[theFirst.x][theFirst.y]="#66bb6a"}, time);
        } 
    }

function drawExplosion(color1, color2, positionColorX,positionColorY){
        if(positionColorY-2 < boardSize){
            setTimeout(function () { boardColor[positionColorX][positionColorY-2] = color1 }, 1000);
            var positionsAndColor ={
                x:positionColorX,
                y:positionColorY-2,
                color:color1
            }
            queueToRegeneateDark.push(positionsAndColor);
            toRegenerateTiles(true);
        }
        if(positionColorY-1 < boardSize){
            setTimeout(function () { boardColor[positionColorX][positionColorY-1] = color2 }, 1000);

            var positionsAndColor ={
                x:positionColorX,
                y:positionColorY-1,
                color:color2
            }
            queueToRegeneateDark.push(positionsAndColor);
            toRegenerateTiles(true);

        }
        if(positionColorY+2 >= boardMinorLimit){
            setTimeout(function () { boardColor[positionColorX][positionColorY+2] = color1 }, 1000);

            var positionsAndColor ={
                x:positionColorX,
                y:positionColorY+2,
                color:color1
            }
            queueToRegeneateDark.push(positionsAndColor);
            toRegenerateTiles(true);

        }
        if (positionColorY+1 >= boardMinorLimit){
            setTimeout(function () { boardColor[positionColorX][positionColorY+1] = color2 }, 1000);

            var positionsAndColor ={
                x:positionColorX,
                y:positionColorY+1,
                color:color2
            }
            queueToRegeneateDark.push(positionsAndColor);
            toRegenerateTiles(true);

        }
        if(positionColorX-2 >= boardMinorLimit){
            setTimeout(function () { boardColor[positionColorX-2][positionColorY] = color1 }, 1000);

            var positionsAndColor ={
                x:positionColorX-2,
                y:positionColorY,
                color:color1
            }
            queueToRegeneateDark.push(positionsAndColor);
            toRegenerateTiles(true);

            if(positionColorY-2 >=boardMinorLimit){                                                            
                setTimeout(function () { boardColor[positionColorX-2][positionColorY-2] = color1 }, 1000);

                var positionsAndColorIn ={
                    x:positionColorX-2,
                    y:positionColorY-2,
                    color:color1
                }
                queueToRegeneateDark.push(positionsAndColorIn);
                toRegenerateTiles(true);

            }
            if(positionColorY-1 >=boardMinorLimit){ 
                setTimeout(function () { boardColor[positionColorX-2][positionColorY-1] = color2 }, 1000);

                var positionsAndColorIn ={
                    x:positionColorX-2,
                    y:positionColorY-1,
                    color:color2
                }
                queueToRegeneateDark.push(positionsAndColorIn);
                toRegenerateTiles(true);

            }
            if(positionColorY+2 < boardSize){                    
                setTimeout(function () { boardColor[positionColorX-2][positionColorY+2] = color1 }, 1000);

                var positionsAndColorIn ={
                    x:positionColorX-2,
                    y:positionColorY+2,
                    color:color1
                }
                queueToRegeneateDark.push(positionsAndColorIn);
                toRegenerateTiles(true);

            }
            if(positionColorY+1 < boardSize){
                setTimeout(function () { boardColor[positionColorX-2][positionColorY+1] = color2 }, 1000);

                var positionsAndColorIn ={
                    x:positionColorX-2,
                    y:positionColorY+1,
                    color:color2
                }
                queueToRegeneateDark.push(positionsAndColorIn);
                toRegenerateTiles(true);

            }
        }

        if(positionColorX-1 >= boardMinorLimit){
            setTimeout(function () { boardColor[positionColorX-1][positionColorY] = color2 }, 1000);

            var positionsAndColor ={
                x:positionColorX-1,
                y:positionColorY,
                color:color2
            }
            queueToRegeneateDark.push(positionsAndColor);
            toRegenerateTiles(true);

            if(positionColorY-1 >=boardMinorLimit){                    
                setTimeout(function () { boardColor[positionColorX-1][positionColorY-1] = color1 }, 1000);
                var positionsAndColorIn ={
                    x:positionColorX-1,
                    y:positionColorY-1,
                    color:color1
                }
                queueToRegeneateDark.push(positionsAndColorIn);
                toRegenerateTiles(true);

            }
            if(positionColorY-2 >=boardMinorLimit){
                setTimeout(function () { boardColor[positionColorX-1][positionColorY-2] = color2 }, 1000);

                var positionsAndColorIn ={
                    x:positionColorX-1,
                    y:positionColorY-2,
                    color:color2
                }
                queueToRegeneateDark.push(positionsAndColorIn);
                toRegenerateTiles(true);

            }
            if(positionColorY+1 < boardSize){
                setTimeout(function () { boardColor[positionColorX-1][positionColorY+1] = color1 }, 1000);

                var positionsAndColorIn ={
                    x:positionColorX-1,
                    y:positionColorY+1,
                    color:color1
                }
                queueToRegeneateDark.push(positionsAndColorIn);
                toRegenerateTiles(true);

            }
            if(positionColorY+2 < boardSize){
                setTimeout(function () { boardColor[positionColorX-1][positionColorY+2] = color2 }, 1000);

                var positionsAndColorIn ={
                    x:positionColorX-1,
                    y:positionColorY+2,
                    color:color2
                }
                queueToRegeneateDark.push(positionsAndColorIn);
                toRegenerateTiles(true);

            }
        }


        ////


        if(positionColorX+2 < boardSize){
            setTimeout(function () { boardColor[positionColorX+2][positionColorY] = color1 }, 1000);

            var positionsAndColor ={
                x:positionColorX+2,
                y:positionColorY,
                color:color1
            }
            queueToRegeneateDark.push(positionsAndColor);
            toRegenerateTiles(true);

            if(positionColorY+2 < boardSize){                                          
                setTimeout(function () { boardColor[positionColorX+2][positionColorY+2] = color1 }, 1000);

                var positionsAndColorIn ={
                    x:positionColorX+2,
                    y:positionColorY+2,
                    color:color1
                }
                queueToRegeneateDark.push(positionsAndColorIn);
                toRegenerateTiles(true);


            }
            if(positionColorY+1 < boardSize){                    
                setTimeout(function () { boardColor[positionColorX+2][positionColorY+1] = color2 }, 1000);

                var positionsAndColorIn ={
                    x:positionColorX+2,
                    y:positionColorY+1,
                    color:color2
                }
                queueToRegeneateDark.push(positionsAndColorIn);
                toRegenerateTiles(true);
            }
            if(positionColorY-2 >=boardMinorLimit){
                setTimeout(function () { boardColor[positionColorX+2][positionColorY-2] = color1 }, 1000); 

                var positionsAndColorIn ={
                    x:positionColorX+2,
                    y:positionColorY-2,
                    color:color1
                }
                queueToRegeneateDark.push(positionsAndColorIn);
                toRegenerateTiles(true);                                       
            }
            if(positionColorY-1 >=boardMinorLimit){
                setTimeout(function () { boardColor[positionColorX+2][positionColorY-1] = color2 }, 1000);

                var positionsAndColorIn ={
                    x:positionColorX+2,
                    y:positionColorY-1,
                    color:color2
                }
                queueToRegeneateDark.push(positionsAndColorIn);
                toRegenerateTiles(true);

            }
        } 


        /////

        if(positionColorX+1 < boardSize){
            setTimeout(function () { boardColor[positionColorX+1][positionColorY] = color2 }, 1000);

            var positionsAndColor ={
                x:positionColorX+1,
                y:positionColorY,
                color:color2
            }
            queueToRegeneateDark.push(positionsAndColor);
            toRegenerateTiles(true);

            if(positionColorY+1 < boardSize){                    
                setTimeout(function () { boardColor[positionColorX+1][positionColorY+1] = color1 }, 1000);

                var positionsAndColorIn ={
                    x:positionColorX+1,
                    y:positionColorY+1,
                    color:color1
                }
                queueToRegeneateDark.push(positionsAndColorIn);
                toRegenerateTiles(true);

            }
            if(positionColorY+2 < boardSize){ 
                setTimeout(function () { boardColor[positionColorX+1][positionColorY+2] = color2 }, 1000);

                var positionsAndColorIn ={
                    x:positionColorX+1,
                    y:positionColorY+2,
                    color:color2
                }
                queueToRegeneateDark.push(positionsAndColorIn);
                toRegenerateTiles(true);

            }
            if(positionColorY-1 >=0){
                setTimeout(function () { boardColor[positionColorX+1][positionColorY-1] = color1 }, 1000);

                var positionsAndColorIn ={
                    x:positionColorX+1,
                    y:positionColorY-1,
                    color:color1
                }
                queueToRegeneateDark.push(positionsAndColorIn);
                toRegenerateTiles(true);  

            }
            if(positionColorY-2 >=0){
                setTimeout(function () { boardColor[positionColorX+1][positionColorY-2] = color2 }, 1000);

                var positionsAndColorIn ={
                    x:positionColorX+1,
                    y:positionColorY-2,
                    color:color2
                }
                queueToRegeneateDark.push(positionsAndColorIn);
                toRegenerateTiles(true);

            }
        } 
    }
});