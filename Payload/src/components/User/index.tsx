import React from 'react';
import UserInfo from './UserInfo';
import UserDropDown from './UserDropDown';
import SteamLogIn from './SteamLogIn';
import './style.scss';
import PlayerViewModel from '../../../../Common/ViewModels/PlayerViewModel';

interface UserProps {
	currentPlayer: PlayerViewModel;
	settingsOnClick: Function;
}

class User extends React.PureComponent<UserProps, {}> {
	render() {
		return this.props.currentPlayer.isLoggedIn ? (
			<div id="User">
				<UserInfo alias={this.props.currentPlayer.alias} avatarUrl={this.props.currentPlayer.avatarUrl} />
				<UserDropDown steamid={this.props.currentPlayer.steamid} settingsOnClick={this.props.settingsOnClick} />
			</div>
		) : (
			<div id="User">
				<SteamLogIn />
			</div>
		);
	}
}

export default User;
