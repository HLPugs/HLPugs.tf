import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.scss';
import { PlayerDataConsumer } from '../../../../../pages/Home';

interface PlayerBoxProps {
	steamid: string;
}

class PlayerBox extends React.PureComponent<PlayerBoxProps, {}> {
	render() {
		return (
			<PlayerDataConsumer>
				{(playerData: any) =>
					playerData && playerData[this.props.steamid] && (
						<Link
							to={`/player/${this.props.steamid}`}
							target="blank"
							className="player"
						>
							<div
								className="playerIcon"
								style={{
									backgroundImage: `url(${playerData[this.props.steamid].avatarUrl})`
								}}
							/>
							<div className="playerName">
								{playerData[this.props.steamid].alias}
							</div>
							<div className="captainStar">
								<FontAwesomeIcon icon="star" />
							</div>
						</Link>
					)
				}
			</PlayerDataConsumer>
		);
	}
}

export default PlayerBox;
