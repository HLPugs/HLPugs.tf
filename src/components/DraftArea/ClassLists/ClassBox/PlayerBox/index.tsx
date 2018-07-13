import * as React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.css';

interface PlayerBoxProps {
    name: string;
    profilePicture: string;
    captain: boolean;
    id: string;
}

class PlayerBox extends React.Component<PlayerBoxProps, {}> {
    playerStar = () => {
        if (this.props.captain) {
            return (
                <div className="captainStar">
                    <FontAwesomeIcon icon="star" />
                </div>
            );
        }

        return null;
    }

    render() {
        return  (
            <Link to={`/profile/${this.props.id}`} target="blank" className="player">
                <div className="playerIcon" style={{backgroundImage: this.props.profilePicture}} />
                <div className="playerName">{this.props.name}</div>
                {this.playerStar()}
            </Link>
        );
    }
}

export default PlayerBox;