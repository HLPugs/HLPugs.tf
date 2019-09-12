import React from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface UserDropDownProps {
	steamid?: string;
	settingsOnClick: Function;
}

class UserDropDown extends React.Component<UserDropDownProps, {}> {
	render() {
		return (
			<ul id="UserDropDown">
				<li>
					<Link to={`/player/${this.props.steamid}`}>
						<FontAwesomeIcon icon="user" />
						Profile
					</Link>
				</li>
				<li onClick={() => this.props.settingsOnClick()}>
					<FontAwesomeIcon icon="cog" />
					Settings
				</li>
			</ul>
		);
	}
}

export default UserDropDown;
