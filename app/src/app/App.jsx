import socketIo from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import PlayerInfo from '../playerInfo/PlayerInfo';
import Paddle from '../paddle/Paddle';
import Ball from '../ball/Ball';

import './app.scss';

let socket;

const App = () => {
    const ENDPOINT = 'localhost:8080';
    
    const [playersState, setPlayersState] = useState([]);
    const [ballState, setBallState] = useState({});

    const [currentUserId, setCurrentUserId] = useState(0);


    useEffect(() => {
        socket = socketIo(ENDPOINT);

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [ENDPOINT]);

    useEffect(() => {
        socket.on('youJoined', (players) => {
            setPlayersState(players);
            setCurrentUserId(players[players.length-1].id);
        });
        socket.on('players', (players) => {
            setPlayersState(players);
        });
        socket.on('ballPosition', (ballState) => {
            setBallState(ballState);
        });
    }, []);

    useEffect(() => {

        function handleKeyDown(event) {
            let currentUserIndex = playersState.findIndex(player => player.id === currentUserId);
    
            // create a new copy and update the position of the paddle
            let newPlayerState = [...playersState];
           
            // current player hits the up arrow
            if(event.keyCode === 38 && newPlayerState[currentUserIndex].paddleTopPosition > 0 && currentUserId) {
                newPlayerState[currentUserIndex].paddleTopPosition--;
                setPlayersState(newPlayerState);
                socket.emit('playersChaned', playersState);
            // current player hits the down arrow
            } else if(event.keyCode === 40 && newPlayerState[currentUserIndex].paddleTopPosition < 80 && currentUserId) {
                newPlayerState[currentUserIndex].paddleTopPosition++;
                setPlayersState(newPlayerState);
                socket.emit('playersChaned', playersState);
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [playersState, currentUserId]);

    return (
        <div className='pong'>
            <h1>Pong Game</h1>
            <PlayerInfo 
                orientation='left'
                playerNumber={1}
                score={playersState[0] && playersState[0].score}
                isCurrent={playersState[0] && currentUserId === playersState[0].id}
            />
            <PlayerInfo 
                orientation='right'
                playerNumber={2}
                score={playersState[1] && playersState[1].score}
                isCurrent={playersState[1] && currentUserId === playersState[1].id}
            />
            <Paddle 
                topPosition={playersState[0] && playersState[0].paddleTopPosition}
                playerNumber={1}
            />
            <Paddle 
                topPosition={playersState[1] && playersState[1].paddleTopPosition}
                playerNumber={2}
            />
            <Ball
                x={ballState.x}
                y={ballState.y} 
            />
            <div className='middleLine' />
        </div>
    )
}

export default App;