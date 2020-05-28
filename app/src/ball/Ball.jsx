import React from 'react';

import './ball.scss';
import PropTypes from 'prop-types';

/**
 * Compontent for rendering the ball
 * 
 * @param x horizontal coordinate
 * @param y vertical coordinate  
 */
const Ball = ({ x, y }) => {

    return (
        <div
            style={{
                top: `${y}vh`,
                left: `${x}vw`
            }}
            className="ball"
        />
    )
};

Ball.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number
};

export default Ball;