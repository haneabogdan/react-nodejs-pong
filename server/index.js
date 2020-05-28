const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const router = require('./router');

// port on which the server is running
const PORT = process.env.PORT || 8080;

// init server and socket
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// initial state
let players = [];
let ballPosition = {
    x: 49,
    y: 45,
    directionX: 1,
    directionY: 1
};

// socket connection handler
io.on('connection', (socket) => {
    // add connected user to the array of players
    if(!players[0]){
        players[0] = {
            id: socket.id,
            score: 0,
            paddleTopPosition: 35,
        };
    } else if(!players[1]) {
        players[1] = {
            id: socket.id,
            score: 0,
            paddleTopPosition: 35,
        };
    }
    socket.emit('youJoined', players);
    socket.emit('ballPosition', ballPosition);
    socket.broadcast.emit('players', players);

    socket.on('playersChaned', (updatedPlayers) => {
        players = updatedPlayers;
        socket.broadcast.emit('players', players);
    });
    
    socket.on('disconnect', () => {
        players.splice(players.indexOf(players.find( (player) => player.id ===  socket.id)), 1);
    })
});

setInterval(() => {
    if( players.length > 1){

        // the ball hits the paddle of player1
        if(ballPosition.x <= 1 && 
            ballPosition.y >= players[0].paddleTopPosition &&
            ballPosition.y <= players[0].paddleTopPosition + 20) {
                ballPosition.directionX = 1;
        // the ball hits the paddle of player2
        } else if(ballPosition.x > 97 && 
            ballPosition.y >= players[1].paddleTopPosition &&
            ballPosition.y <= players[1].paddleTopPosition + 20) {
                ballPosition.directionX = -1;
        // the ball hits the border of player2
        }else if(ballPosition.x > 98) {
            ballPosition.directionX = -1;

            players[0] = {
                ...players[0],
                score: ++players[0].score
            }
            io.sockets.emit('players', players);
        // the ball hits the border of player1
        } else if (ballPosition.x <= 0) {
            ballPosition.directionX = 1;

            players[1] = {
                ...players[1],
                score: ++players[1].score
            }
            io.sockets.emit('players', players);
        }
        // the ball hits the bottom border
        if(ballPosition.y > 95.5) {
            ballPosition.directionY = -1;
        // the ball hits the top border
        } else if (ballPosition.y <= 0) {
            ballPosition.directionY = 1;
        }

        ballPosition = {
            ...ballPosition,
            x: ballPosition.x + (0.1 * ballPosition.directionX),
            y: ballPosition.y + (0.1 * ballPosition.directionY),
        }
    } else {
        // if one of the players left, reset the position of the ball
        ballPosition = {
            x: 49,
            y: 45,
            directionX: 1,
            directionY: 1
        }
        return;
    }

    io.sockets.emit('ballPosition', ballPosition);

}, 5);

app.use(router);

server.listen(PORT, () => {
    console.log('server running on port '+ PORT);
})