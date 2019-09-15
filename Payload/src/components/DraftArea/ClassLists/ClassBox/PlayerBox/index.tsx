import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.scss';
import { LoggedInPlayersConsumer } from '../../../../../pages/Home';
import SteamID from '../../../../../../../Common/Types/SteamID';
import PlayerViewModel from '../../../../../../../Common/ViewModels/PlayerViewModel';

interface PlayerBoxProps {
	steamid: SteamID;
}

class PlayerBox extends React.PureComponent<PlayerBoxProps, {}> {
	render() {
		return (
			<LoggedInPlayersConsumer>
				{(loggedInPlayers: PlayerViewModel[]) =>
					loggedInPlayers.length > 0 && (
						<Link to={`/player/${this.props.steamid}`} target="blank" className="player">
							<div
								className="playerIcon"
								style={{
									backgroundImage: `url(${
										loggedInPlayers.find(p => p.steamid === this.props.steamid)
											? loggedInPlayers.find(p => p.steamid === this.props.steamid)!.avatarUrl
											: null
									})`
								}}
							/>
							<div className="playerName">
								{loggedInPlayers.find(p => p.steamid === this.props.steamid)
									? loggedInPlayers.find(p => p.steamid === this.props.steamid)!.alias
									: null}
							</div>
							<div className="captainStar">
								<FontAwesomeIcon icon="star" />
							</div>
						</Link>
					)
				}
			</LoggedInPlayersConsumer>
		);
	}
}

export default PlayerBox;
