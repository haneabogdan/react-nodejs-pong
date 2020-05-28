import React from 'react';
import PropTypes from 'prop-types';

import './paddle.scss';

/**
 * Compontent for rendering a paddle
 * 
 * @param topPosition highest position of the paddle
 * @param playerNumber number of the player to which the paddle coresponds  
 */
const Paddle = ( { topPosition,  playerNumber }) => {

    return (
        <div
            role='button'
            className='paddle'
            autoFocus={playerNumber === 1}
            style={{
            top: `${topPosition}vh`,
            left: `${playerNumber === 1 ? 0 : 99}vw`
            }}
        />
    )
};

Paddle.propTypes = {
    topPosition: PropTypes.number,
    playerNumber: PropTypes.number
};

export default Paddle;