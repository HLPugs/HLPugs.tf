import React from 'react';
import UserInfo from './UserInfo';
import UserDropDown from './UserDropDown';
import SteamLogIn from './SteamLogIn';
import './style.scss';
import PlayerViewModel from '../../../../Common/ViewModels/PlayerViewModel';

interface UserProps {
	user: PlayerViewModel;
	settingsOnClick: Function;
}

class User extends React.PureComponent<UserProps, {}> {
	render() {
		if (this.props.user.isLoggedIn) {
			return (
				<div id="User">
					<UserInfo
						alias={this.props.user.alias}
						avatarUrl={this.props.user.avatarUrl}
					/>
					<UserDropDown
						steamid={this.props.user.steamid}
						settingsOnClick={this.props.settingsOnClick}
					/>
				</div>
			);
		} else if (this.props.user.isLoggedIn === false) {
			return (
				<div id="User">
					<SteamLogIn />
				</div>
			);
		}
		return null;
	}
}

export default User;
