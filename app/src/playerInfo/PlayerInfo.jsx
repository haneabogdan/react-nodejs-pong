import React from 'react';
import PropTypes from 'prop-types';

import './player-info.scss';

/**
 * Compontent for rendering the infos of a given player
 * 
 * @param orientation which side of the field the player is
 * @param playerNumber number of the player to which the infos coresponds
 * @param score how many points the player has
 * @param isCurrent boolean representing if the infos corespond to the current user 
 */
const PlayerInfo = ({ orientation, playerNumber, score, isCurrent }) => {
    return (
        <div className={`${orientation} ${isCurrent ? 'currentUser' : ''}`}>
            <p>Player {playerNumber}</p>
            <p>Score: {score}</p>
        </div>
    )
}

PlayerInfo.propTypes = {
    orientation: PropTypes.string,
    playerNumber: PropTypes.number,
    score: PropTypes.number,
    isCurrent: PropTypes.bool
};

export default PlayerInfo;